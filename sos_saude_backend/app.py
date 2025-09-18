from flask import Flask, request, jsonify
from .extensions import db
from .models import Patient
from .config import Config
from flask_migrate import Migrate

migrate = Migrate()

def calcular_risco(idade, sintomas, gestante=False, lactante=False, pcd=False, crianca_colo=False):
    sintomas = sintomas.lower()
    criticos = ["dor no peito", "falta de ar", "desmaio", "hemorragia"]
    if any(s in sintomas for s in criticos):
        return "vermelho"
    if idade >= 60 or idade <= 5 or gestante or lactante or pcd or crianca_colo:
        return "amarelo"
    comuns = ["febre", "tosse", "dor de cabeça"]
    if any(s in sintomas for s in comuns):
        return "amarelo"
    return "verde"

def create_app():
    app = Flask(__name__)
    app.config.from_object("sos_saude_backend.config.Config")

    db.init_app(app)
    migrate.init_app(app, db)

    @app.route("/pacientes/register", methods=["POST"])
    def cadastrar_paciente():
        data = request.get_json()
        paciente = Patient(
            nome=data["nome"],
            idade=data["idade"],
            sintomas=data["sintomas"],
            gestante=data.get("gestante", False),
            lactante=data.get("lactante", False),
            pcd=data.get("pcd", False),
            crianca_colo=data.get("crianca_colo", False),
        )
        paciente.risco = calcular_risco(
            paciente.idade, paciente.sintomas,
            gestante=paciente.gestante,
            lactante=paciente.lactante,
            pcd=paciente.pcd,
            crianca_colo=paciente.crianca_colo
        )
        db.session.add(paciente)
        db.session.commit()
        return {
            "message": "Paciente cadastrado com sucesso!",
            "paciente": {
                "nome": paciente.nome,
                "idade": paciente.idade,
                "risco": paciente.risco,
                "gestante": paciente.gestante,
                "lactante": paciente.lactante,
                "pcd": paciente.pcd,
                "crianca_colo": paciente.crianca_colo
            }
        }, 201

    @app.route("/fila", methods=["GET"])
    def fila_atendimento():
        pacientes = Patient.query.all()

        def prioridade(p):
            if p.risco == "vermelho":
                return (0, 0)
            if p.risco == "amarelo" and (p.gestante or p.lactante or p.pcd or p.crianca_colo or p.idade >= 60):
                return (1, 0)
            if p.risco == "amarelo":
                return (2, 0)
            return (3, 0)

        pacientes_ordenados = sorted(pacientes, key=prioridade)

        resultado = [
            {
                "id": p.id,
                "nome": p.nome,
                "idade": p.idade,
                "risco": p.risco,
                "gestante": p.gestante,
                "lactante": p.lactante,
                "pcd": p.pcd,
                "crianca_colo": p.crianca_colo
            }
            for p in pacientes_ordenados
        ]

        return {"fila": resultado}, 200

    @app.route("/pacientes", methods=["GET"])
    def listar_pacientes():
        pacientes = Patient.query.all()

        resultado = [
            {
                "id": p.id,
                "nome": p.nome,
                "idade": p.idade,
                "sintomas": p.sintomas,
                "risco": p.risco,
                "gestante": p.gestante,
                "lactante": p.lactante,
                "pcd": p.pcd,
                "crianca_colo": p.crianca_colo
            }
            for p in pacientes
        ]

        return {"pacientes": resultado}, 200

    return app
