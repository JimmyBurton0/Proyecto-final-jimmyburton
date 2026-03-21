from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    _tablename_ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    passwordHash = db.Column(db.String(255), nullable=False)
    roleId = db.Column(db.Integer, db.ForeignKey('role.id'))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación para acceder al nombre del rol fácilmente
    role = db.relationship('Role', backref='users')

    def serialize(self):
        return {
            "id": self.id,
            "fullName": self.fullName,
            "email": self.email,
            "role": self.role.name if self.role else None, # Muestra 'comprador' en vez de 1
            "createdAt": self.createdAt
        }

class Role(db.Model):
    _tablename_ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def _repr_(self):
        return self.name # Esto hace que en el Admin veas "comprador" en los menús

class Category(db.Model):
    _tablename_ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def _repr_(self):
        return self.name

class Product(db.Model):
    _tablename_ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100))
    priceUsd = db.Column(db.Numeric(10, 2), nullable=False)
    stockQuantity = db.Column(db.Integer, default=0)
    categoryId = db.Column(db.Integer, db.ForeignKey('category.id'))
    
    category = db.relationship('Category', backref='products')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "price": str(self.priceUsd),
            "category": self.category.name if self.category else None
        }

# ... (Las demás tablas Compatibility, Cart y CartItem se mantienen igual)

class Compatibility(db.Model): 
    _tablename_ = 'compatibility'
    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    carBrand = db.Column(db.String(100))
    carModel = db.Column(db.String(100))
    yearStart = db.Column(db.Integer)
    yearEnd = db.Column(db.Integer)

class Cart(db.Model):
    _tablename_ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))

class CartItem(db.Model):
    _tablename_ = 'cart_item'
    id = db.Column(db.Integer, primary_key=True)
    cartId = db.Column(db.Integer, db.ForeignKey('cart.id'))
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)