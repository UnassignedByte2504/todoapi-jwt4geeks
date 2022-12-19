"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Todo, TodoList
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def handle_signup():
    # Get the post data from the request
    request_data = request.get_json(force=True)
    # Check if email and username already exists in the database
    if db.session.query(User).filter(User.email == request_data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    if db.session.query(User).filter(User.username == request_data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    # If email and username are unique, create new user
    new_user = User(
        email=request_data['email'],
        username=request_data['username'],
        password=request_data['password'],
        is_active=True
        )
    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()
    # Serialize and return the new user data
    return jsonify(
        {
            "message": "User created successfully",
            "user": new_user.serialize()
        }
    ), 201


@api.route('/login', methods=['POST'])
def handle_login():
    # Get the post data from the request
    request_data = request.get_json(force=True)
    # Get the user from the database
    user = db.session.query(User).filter(User.email == request_data['email'] and User.password == request_data['password']).first()
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
        # Generate the access token
    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Logged in as {}".format(user.username), "access_token": access_token}), 200


@api.route('/<string:username_var>/todolists', methods=['GET', 'POST'])
@jwt_required()
def handle_todolists(username_var):
    # Get the user from the database
    current_identity = get_jwt_identity()
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
        # If the user is found, check if the user is the same user as the one who
        # sent the request
    if not current_identity == user.id:
        return jsonify({"message": "Unauthorized access"}), 401
        # If the user is the same user as the one who sent the request, return
        # all todolists
    if request.method == 'GET':
        #  if theres not todolist yet, return a message
        if not user.todo_list:
            return jsonify({"message": "You haven't created any todo list yet"}), 404
            # If theres todolists, return them
            # Serialize and return the todolists

        todolists = db.session.query(TodoList).filter(TodoList.user_id == user.id).all()
        return jsonify({"todolists": [todolist.serialize() for todolist in todolists]}), 200
        # If the request method is POST, create a new todolist
        # Get the post data from the request
    request_data = request.get_json(force=True)
    new_todolist = TodoList(
        name=request_data['name'],
        description=request_data['description'],
        user_id=user.id
        )
    # Add the todolist to the database
    db.session.add(new_todolist)
    db.session.commit()
    return jsonify({"message": "Todo list created successfully", "todolist": new_todolist.serialize()}), 201


@api.route('/<string:username_var>/todolists/<string:todolist_name>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@jwt_required()
def handle_todo(username_var, todolist_name):
    # Get the user from the database
    current_identity = get_jwt_identity()
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404
        # If the user is found, check if the user is the same user as the one who
        # sent the request
    if not current_identity == user.id:
        return jsonify({"message": "Unauthorized access"}), 401
    if request.method == 'GET':
        # Get the todolist from the database
        todolist = db.session.query(TodoList).filter(TodoList.user_id == user.id, TodoList.name == todolist_name).first()
        if not todolist:
            return jsonify({"message": "Todo list not found in the database"}), 404
        # Serialize and return the todolist
        return jsonify({"todolist": todolist.serialize()}), 200

    if request.method == 'PUT':
        #edit the current todo list name
        request_data = request.get_json(force=True)
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        todolet.name = request_data['name']
        todolet.description = request_data['description']

        db.session.commit()
        return jsonify({"message": "Todo list name changed successfully"}), 200

    if request.method =='DELETE':
        #delete the current todo list
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        db.session.delete(todolet)
        db.session.commit()
        return jsonify({"message": "Todo list deleted successfully from the database"}), 200

    if request.method =='POST':
        #add a new todo to the current todo list
        request_data = request.get_json(force=True)
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        todo = Todo(
            name=request_data['name'],
            description=request_data['description'],
            due_date = request_data['due_date'],
            status = request_data['status'],
            priority = request_data['priority'],
            todo_list_id = todolet.id
        )
        db.session.add(todo)
        db.session.commit()
        return jsonify({"message": "Todo added successfully to the database"}), 200


@api.route('/<string:username_var>/todolists/<string:todolist_name>/<string:todo_name>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def todo_item(username_var, todolist_name, todo_name):
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404
    #get the todo list
    todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name).first()
    if not todolet:
        return jsonify({"message": "Todo list not found in the database"}), 404

    if request.method =='GET':
        #get the todo item
        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        return jsonify(todo.serialize()), 200

    if request.method =='PUT':
        #update the todo item
        request_data = request.get_json(force=True)
        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        todo.name = request_data['name']
        todo.description = request_data['description']
        todo.due_date = request_data['due_date']
        todo.status = request_data['status']
        todo.priority = request_data['priority']
        db.session.commit()
        return jsonify({"message": "Todo item updated successfully in the database"}), 200

    if request.method =='DELETE':
        #delete the todo item
        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo item deleted successfully in the database"}), 200

