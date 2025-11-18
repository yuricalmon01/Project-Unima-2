// ============================================
// DADOS MOCKADOS PARA DESENVOLVIMENTO
// Use USE_MOCK=true para ativar
// ============================================

// Usuários mockados
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@unima.com",
    password_hash:
      "$2a$10$HPFwcSDMQbTpE.CxfpyinuGNpeSQxpcQ2QRfhqDMj3r.dj8So9hkS", // "123456"
    first_name: "Admin",
    last_name: "Sistema",
    user_type_id: 1,
    user_type_name: "Admin",
    active: true,
    cpf: "000.000.000-00",
    phone: "(82) 99999-9999",
    birth_date: "1990-01-01",
    gender: "M",
    last_login: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    username: "medico1",
    email: "medico@unima.com",
    password_hash:
      "$2a$10$HPFwcSDMQbTpE.CxfpyinuGNpeSQxpcQ2QRfhqDMj3r.dj8So9hkS", // "123456"
    first_name: "Dr. João",
    last_name: "Silva",
    user_type_id: 2,
    user_type_name: "Doctor",
    active: true,
    cpf: "111.111.111-11",
    phone: "(82) 98888-8888",
    birth_date: "1985-05-15",
    gender: "M",
    last_login: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    username: "paciente1",
    email: "paciente@unima.com",
    password_hash:
      "$2a$10$HPFwcSDMQbTpE.CxfpyinuGNpeSQxpcQ2QRfhqDMj3r.dj8So9hkS", // "123456"
    first_name: "Maria",
    last_name: "Santos",
    user_type_id: 5,
    user_type_name: "Patient",
    active: true,
    cpf: "222.222.222-22",
    phone: "(82) 97777-7777",
    birth_date: "1995-08-20",
    gender: "F",
    last_login: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Pacientes mockados
const mockPatients = [
  {
    id: 1,
    user_id: 3, // paciente1 (Maria Santos)
    patient_number: "PAT-0001",
    nome: "Maria",
    sobrenome: "Santos",
    email: "paciente@unima.com",
    blood_type: "O+",
    symptoms: null,
    risk_score: null,
    created_at: new Date(),
  },
];

// Simulação de operações de banco de dados
class MockDB {
  constructor() {
    this.users = [...mockUsers];
    this.patients = [...mockPatients];
    this.nextUserId = Math.max(...this.users.map((u) => u.id)) + 1;
    this.nextPatientId = Math.max(...this.patients.map((p) => p.id)) + 1;
  }

  // Métodos auxiliares para SELECT
  _mapUserToResponse(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type_id: user.user_type_id,
      userType: user.user_type_name || this._getUserTypeName(user.user_type_id),
      active: user.active,
    };
  }

  _getUserTypeName(userTypeId) {
    const typeMap = {
      1: "Admin",
      2: "Doctor",
      3: "Nurse",
      4: "Receptionist",
      5: "Patient",
    };
    return typeMap[userTypeId] || "Patient";
  }

  _handleSelectUsers(queryLower, params) {
    // Função auxiliar para normalizar username
    const normalizeUsername = (username) => {
      if (!username) return "";
      return username.trim().replace(/^@+/, "").toLowerCase(); // Remove espaços, @ do início e converte para lowercase
    };

    // SELECT users com JOIN user_types (para login)
    if (
      queryLower.includes("join") &&
      queryLower.includes("user_types") &&
      queryLower.includes("where") &&
      queryLower.includes("username")
    ) {
      const username = normalizeUsername(params[0]);
      const user = this.users.find(
        (u) => normalizeUsername(u.username) === username && u.active
      );
      // Para login, retorna o objeto completo (inclui user_type_name)
      return user ? [[user]] : [[]];
    }

    // SELECT users com WHERE
    if (queryLower.includes("where")) {
      if (queryLower.includes("username")) {
        const username = normalizeUsername(params[0]);
        const user = this.users.find(
          (u) => normalizeUsername(u.username) === username && u.active
        );
        return user ? [[this._mapUserToResponse(user)]] : [[]];
      }
      if (queryLower.includes("id = ?") || queryLower.includes("id=?")) {
        const id = Number.parseInt(params[0], 10);
        const user = this.users.find((u) => u.id === id);
        return user ? [[this._mapUserToResponse(user)]] : [[]];
      }
      return [this.users.map((u) => this._mapUserToResponse(u))];
    }

    // Lista todos os usuários
    return [this.users.map((u) => this._mapUserToResponse(u))];
  }

  _handleSelectPatients(queryLower) {
    // SELECT patients com JOIN users
    if (queryLower.includes("join")) {
      const results = this.patients
        .map((p) => {
          const user = this.users.find((u) => u.id === p.user_id);
          if (!user) {
            console.log(
              `[MockDB] Paciente ${p.id} não tem usuário correspondente (user_id: ${p.user_id})`
            );
            return null;
          }
          const result = {
            id: p.id,
            nome: user.first_name || p.nome || "",
            sobrenome: user.last_name || p.sobrenome || "",
            email: user.email || p.email || "",
            symptoms: p.symptoms || null,
            risk_score: p.risk_score || null,
            created_at:
              p.created_at instanceof Date
                ? p.created_at.toISOString()
                : p.created_at,
          };
          // Valida se tem todos os campos necessários
          if (!result.nome || !result.sobrenome || !result.email) {
            console.log(
              `[MockDB] Paciente ${p.id} tem dados incompletos:`,
              result
            );
            return null;
          }
          return result;
        })
        .filter((p) => p !== null);

      if (queryLower.includes("order by") && queryLower.includes("desc")) {
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      console.log(`[MockDB] Retornando ${results.length} pacientes`);
      return [results];
    }

    // SELECT patients simples
    return [
      this.patients
        .map((p) => ({
          id: p.id,
          nome: p.nome || "",
          sobrenome: p.sobrenome || "",
          email: p.email || "",
          symptoms: p.symptoms || null,
          risk_score: p.risk_score || null,
          created_at:
            p.created_at instanceof Date
              ? p.created_at.toISOString()
              : p.created_at,
        }))
        .filter((p) => p.nome && p.sobrenome && p.email),
    ];
  }

  _handleInsertUsers(params, queryLower) {
    let newUser;

    // Detecta a ordem dos parâmetros baseado na query
    // Função auxiliar para normalizar username
    const normalizeUsername = (username) => {
      if (!username) return "";
      return username.trim().replace(/^@+/, ""); // Remove espaços e @ do início
    };

    // Ordem 1: user_type_id, username, email, password_hash, first_name, last_name, active (de pacientes)
    if (queryLower.includes("user_type_id, username")) {
      // Para pacientes, o username pode vir com underscores ou outros caracteres
      // Normaliza removendo @ do início e espaços
      const patientUsername = normalizeUsername(params[1] || "");

      newUser = {
        id: this.nextUserId++,
        user_type_id: params[0],
        username: patientUsername, // Normaliza username
        email: params[2],
        password_hash: params[3],
        first_name: params[4],
        last_name: params[5],
        active: params[6] ?? true,
        user_type_name: this._getUserTypeName(params[0]),
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    // Ordem 2: username, email, password_hash, first_name, last_name, user_type_id, active (de usuários)
    else {
      newUser = {
        id: this.nextUserId++,
        username: normalizeUsername(params[0]), // Normaliza username
        email: params[1],
        password_hash: params[2],
        first_name: params[3],
        last_name: params[4],
        user_type_id: params[5] || 5,
        active: params[6] ?? true,
        user_type_name: this._getUserTypeName(params[5] || 5),
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    this.users.push(newUser);
    return [{ insertId: newUser.id }];
  }

  _handleInsertPatients(params) {
    // Ordem: user_id, patient_number, blood_type, symptoms, risk_score
    const riskScore = params[4] || null;
    console.log(`[MockDB] Criando paciente com risk_score:`, riskScore);

    const newPatient = {
      id: this.nextPatientId++,
      user_id: params[0],
      patient_number: params[1],
      blood_type: params[2],
      symptoms: (() => {
        if (!params[3]) return null;
        return typeof params[3] === "string"
          ? JSON.parse(params[3])
          : params[3];
      })(),
      risk_score: riskScore, // Garante que seja salvo mesmo se for string
      created_at: new Date(),
    };

    console.log(`[MockDB] Paciente criado:`, {
      id: newPatient.id,
      risk_score: newPatient.risk_score,
      symptoms: newPatient.symptoms,
    });
    const user = this.users.find((u) => u.id === params[0]);
    if (user) {
      newPatient.nome = user.first_name;
      newPatient.sobrenome = user.last_name;
      newPatient.email = user.email;
    }
    this.patients.push(newPatient);
    return [{ insertId: newPatient.id }];
  }

  _handleUpdateUsers(queryLower, params) {
    if (queryLower.includes("last_login")) {
      const id = params[0];
      const user = this.users.find((u) => u.id === id);
      if (user) user.last_login = new Date();
      return [{ affectedRows: 1 }];
    }
    if (queryLower.includes("email")) {
      const id = params[4];
      const user = this.users.find((u) => u.id === id);
      if (user) {
        user.email = params[0];
        user.first_name = params[1];
        user.last_name = params[2];
        user.active = params[3];
      }
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  _handleDeleteUsers(params) {
    const id = params[0];
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // Simula pool.execute()
  async execute(query, params = []) {
    const queryLower = query.toLowerCase().trim();

    // SELECT queries
    if (queryLower.includes("select")) {
      if (
        queryLower.includes("patients") ||
        queryLower.includes("from patients")
      ) {
        return this._handleSelectPatients(queryLower);
      }
      if (queryLower.includes("users")) {
        return this._handleSelectUsers(queryLower, params);
      }
    }

    // INSERT queries
    if (queryLower.includes("insert")) {
      if (queryLower.includes("users")) {
        return this._handleInsertUsers(params, queryLower);
      }
      if (queryLower.includes("patients")) {
        return this._handleInsertPatients(params);
      }
    }

    // UPDATE queries
    if (queryLower.includes("update") && queryLower.includes("users")) {
      return this._handleUpdateUsers(queryLower, params);
    }

    // DELETE queries
    if (queryLower.includes("delete") && queryLower.includes("users")) {
      return this._handleDeleteUsers(params);
    }

    // Default: retorna array vazio
    return [[]];
  }

  // Simula getConnection() para transações
  async getConnection() {
    return {
      execute: this.execute.bind(this),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: async () => {},
    };
  }
}

module.exports = { mockUsers, mockPatients, MockDB };
