
from flask_sqlalchemy import SQLAlchemy
import datetime
import math
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False) 
    todo_list = relationship("TodoList", backref="user")
    completed_todos = db.Column(db.Integer, unique=False, nullable=False, default=0)
    def __repr__(self):
        return '<User %r>' % self.username

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active,
            'todo_list': [todo.serialize() for todo in self.todo_list],
            'completed_todos': self.completed_todos
        }
            


class TodoList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    todos = relationship("Todo")

    def __repr__(self):
        return '<TodoList %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "user_id": self.user_id,
            "todos": [todo.serialize() for todo in self.todos]
        }
 
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    is_completed = db.Column(db.Boolean(), unique=False, nullable=False)
    todo_list_id = db.Column(db.Integer, db.ForeignKey('todo_list.id'), nullable=False)

    def __repr__(self):
        return '<Todo %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_completed": self.is_completed,
            "todo_list_id": self.todo_list_id
        }
        