import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando re-hash de senhas (detectando hashes em plaintext)...');

  // Apenas usuários ativos serão re-hashados por padrão para evitar alterações em contas inativas
  const onlyActive = process.env.REHASH_ONLY_ACTIVE !== 'false';
  const query = onlyActive
    ? 'SELECT id, password_hash, username, email FROM users WHERE active = 1'
    : 'SELECT id, password_hash, username, email FROM users';

  const [users] = await pool.query(query);
  let updated = 0;

  for (const u of users) {
    const current = u.password_hash || '';

    // Detecta se já é um bcrypt hash (começa com $2a$ $2b$ ou $2y$)
    if (current.startsWith('$2a$') || current.startsWith('$2b$') || current.startsWith('$2y$')) {
      continue; // já está hash
    }

    if (!current || current.trim().length === 0) {
      console.warn(`Usuário ${u.id} (${u.username || u.email}) sem senha armazenada. Ignorando.`);
      continue;
    }

    try {
      // Assume que `password_hash` contém a senha em texto plano
      const newHash = await bcrypt.hash(current, 10);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, u.id]);
      updated++;
      console.log(`Re-hash aplicado para user id=${u.id} (${u.username || u.email})`);
    } catch (err) {
      console.error(`Erro ao re-hash user id=${u.id}:`, err.message);
    }
  }

  console.log(`Re-hash finalizado. Total atualizados: ${updated}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro no script de re-hash:', err);
  process.exit(1);
});
