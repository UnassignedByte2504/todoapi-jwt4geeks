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
    request_data = request.get_json(force=True)
    if db.session.query(User).filter(User.email == request_data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    if db.session.query(User).filter(User.username == request_data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    new_user = User(
        email=request_data['email'],
        username=request_data['username'],
        password=request_data['password'],
        is_active=True
        )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(
        {
            "message": "User created successfully",
            "user": new_user.serialize()
        }
    ), 201


@api.route('/login', methods=['POST'])
def handle_login():

    request_data = request.get_json(force=True)

    user = db.session.query(User).filter(User.email == request_data['email'] and User.password == request_data['password']).first()
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Logged in as {}".format(user.username), "access_token": access_token, "username": user.username}), 200


@api.route('/<string:username>', methods=['GET'])
@jwt_required()
def handle_profile(username):

    user = db.session.query(User).filter(User.username == username).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404
    return user.serialize(), 200



@api.route('/<string:username_var>/todolists', methods=['GET', 'POST'])
@jwt_required()
def handle_todolists(username_var):

    current_identity = get_jwt_identity()
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not current_identity == user.id:
        return jsonify({"message": "Unauthorized access"}), 401

    if request.method == 'GET':

        if not user.todo_list:
            return jsonify({"message": "You haven't created any todo list yet"}), 404
        todolists = db.session.query(TodoList).filter(TodoList.user_id == user.id).all()
        return jsonify({"todolists": [todolist.serialize() for todolist in todolists]}), 200

    request_data = request.get_json(force=True)
    new_todolist = TodoList(
        name=request_data['name'],
        description=request_data['description'],
        user_id=user.id
        )

    db.session.add(new_todolist)
    db.session.commit()
    return jsonify({"message": "Todo list created successfully", "todolist": new_todolist.serialize()}), 201


@api.route('/<string:username_var>/todolists/<string:todolist_name_var>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@jwt_required()
def handle_todo(username_var, todolist_name_var):
    current_identity = get_jwt_identity()
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404
    if not current_identity == user.id:
        return jsonify({"message": "Unauthorized access"}), 401
    if request.method == 'GET':
        todolist = db.session.query(TodoList).filter(TodoList.user_id == user.id, TodoList.name == todolist_name_var).first()
        if not todolist:
            return jsonify({"message": "Todo list not found in the database"}), 404
        return jsonify({"todolist": todolist.serialize()}), 200

    if request.method == 'PUT':
        request_data = request.get_json(force=True)
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id, TodoList.name == todolist_name_var).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        default_values = todolet
        todolet.name = request_data.get('name', default_values.name)
        todolet.description = request_data.get('description', default_values.description)
        db.session.commit()
        return jsonify({"message": "Todo list updated successfully"}), 200

    if request.method =='DELETE':
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id, TodoList.name == todolist_name_var).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        db.session.delete(todolet)
        db.session.commit()
        return jsonify({"message": "Todo list deleted successfully from the database"}), 200
    if request.method =='POST':
        request_data = request.get_json(force=True)
        todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id, TodoList.name == todolist_name_var).first()
        if not todolet:
            return jsonify({"message": "Todo list not found in the database"}), 404
        todo = Todo(
            name=request_data['name'],
            description=request_data['description'],
            is_completed= False,
            todo_list_id = todolet.id
        )
        db.session.add(todo)
        db.session.commit()
        return jsonify({"message": "Todo added successfully to the database"}), 200


@api.route('/<string:username_var>/todolists/<string:todolist_name_var>/<string:todo_name>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def todo_item(username_var, todolist_name_var, todo_name):
    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404

    todolet = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name_var).first()
    if not todolet:
        return jsonify({"message": "Todo list not found in the database"}), 404

    if request.method =='GET':

        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        return jsonify(todo.serialize()), 200

    if request.method =='PUT':

        request_data = request.get_json(force=True)
        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        default_values = todo
        todo.name = request_data.get('name', default_values.name)
        todo.description = request_data.get('description', default_values.description)
        todo.is_completed = request_data.get('is_completed', default_values.is_completed)
        db.session.commit()
        return jsonify({"message": "Todo item updated successfully in the database"}), 200

    if request.method =='DELETE':

        todo = db.session.query(Todo).filter(Todo.todo_list_id == todolet.id and Todo.name == todo_name).first()
        if not todo:
            return jsonify({"message": "Todo item not found in the database"}), 404
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo item deleted successfully in the database"}), 200

@api.route('/<string:username_var>/todolists/<string:todolist_name_var>/<string:todo_name>/complete', methods=['PUT'])
def complete_todo(username_var, todolist_name_var, todo_name):

    user = db.session.query(User).filter(User.username == username_var).first()
    if not user:
        return jsonify({"message": "User not found in the database"}), 404

    todolist = db.session.query(TodoList).filter(TodoList.user_id == user.id and TodoList.name == todolist_name_var).first()
    if not todolist:
        return jsonify({"message": "Todo list not found in the database"}), 404

    todo = db.session.query(Todo).filter(Todo.todo_list_id == todolist.id and Todo.name == todo_name).first()
    if not todo:
        return jsonify({"message": "Todo item not found in the database"}), 404

    todo.is_completed = True
    db.session.commit()
    return jsonify({"message": "Todo item completed successfully in the database"}), 200
