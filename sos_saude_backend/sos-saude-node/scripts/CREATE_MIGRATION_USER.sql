-- CREATE_MIGRATION_USER.sql
-- Execute como administrador (root) no MySQL ou via RDS console
-- Substitua <DB_NAME> e <MIGRATE_USER_PASS> pelos valores reais

CREATE USER IF NOT EXISTS 'unima_migrate'@'%' IDENTIFIED BY '<MIGRATE_USER_PASS>';
-- Concede permissões mínimas necessárias para o script de migração
GRANT SELECT, UPDATE ON `<DB_NAME>`.users TO 'unima_migrate'@'%';
-- Se o script precisar ler outras tabelas, conceda SELECT nelas explicitamente
-- Exemplo: GRANT SELECT ON `<DB_NAME>`.patients TO 'unima_migrate'@'%';

FLUSH PRIVILEGES;

-- OBS: Para maior segurança em produção, restrinja o host (ex.: 'unima_migrate'@'10.0.0.5')
-- ou crie a conta com acesso apenas a partir do bastion/EC2 que executará o script.
