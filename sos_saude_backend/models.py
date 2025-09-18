from .extensions import db, bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    perfil = db.Column(db.String(20), default="usuario")  

    def set_password(self, senha):
        self.senha_hash = bcrypt.generate_password_hash(senha).decode("utf-8")

    def check_password(self, senha):
        return bcrypt.check_password_hash(self.senha_hash, senha) 

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    sintomas = db.Column(db.Text, nullable=False)
    risco = db.Column(db.String(20), default="verde")  
    prioridade_sus = db.Column(db.Boolean, default=False)  
    gestante = db.Column(db.Boolean, default=False)
    lactante = db.Column(db.Boolean, default=False)
    pcd = db.Column(db.Boolean, default=False)
    crianca_colo = db.Column(db.Boolean, default=False)
