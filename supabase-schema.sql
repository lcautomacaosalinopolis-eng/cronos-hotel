create extension if not exists "pgcrypto";

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  category text not null,
  floor text,
  status text default 'limpo' check (status in ('limpo','reservado','ocupado','limpeza','manutencao','bloqueado')),
  created_at timestamptz default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  document text,
  created_at timestamptz default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  guest_id uuid references guests(id) on delete set null,
  guest_name text not null,
  phone text,
  email text,
  room_id uuid references rooms(id) on delete restrict,
  room_number text not null,
  category text not null,
  checkin timestamptz not null,
  checkout timestamptz not null,
  daily_rate numeric(12,2) default 0,
  guests_count int default 1,
  status text default 'reservado' check (status in ('reservado','confirmado','ocupado','finalizado','cancelado','bloqueado')),
  payment_method text default 'manual',
  paid_amount numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now(),
  constraint valid_period check (checkout > checkin)
);

create table if not exists cash_movements (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references reservations(id) on delete set null,
  type text not null check (type in ('entrada','saida','estorno')),
  description text not null,
  amount numeric(12,2) not null default 0,
  method text default 'manual',
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_name text default 'sistema',
  action text not null,
  details text,
  created_at timestamptz default now()
);

alter table rooms enable row level security;
alter table guests enable row level security;
alter table reservations enable row level security;
alter table cash_movements enable row level security;
alter table audit_logs enable row level security;

create policy "public read rooms" on rooms for select using (true);
create policy "public write rooms" on rooms for all using (true) with check (true);
create policy "public guests" on guests for all using (true) with check (true);
create policy "public reservations" on reservations for all using (true) with check (true);
create policy "public cash" on cash_movements for all using (true) with check (true);
create policy "public audit" on audit_logs for all using (true) with check (true);

with room_catalog(category, floor, numbers) as (
  values
    ('Casal', '1º Andar', array['119']),
    ('Casal', '2º Andar', array['240']),
    ('Triplo', '1º Andar', array['115','116','117','118']),
    ('Triplo', '2º Andar', array['234','235','237','238','239']),
    ('Triplo', '3º Andar', array['359','360','361','362','363','364','365']),
    ('Quádruplo', '1º Andar', array['106','109','110']),
    ('Quádruplo', '2º Andar', array['233']),
    ('Quádruplo', '3º Andar', array['353','355','358']),
    ('Quíntuplo', '2º Andar', array['230','232']),
    ('Quíntuplo', '3º Andar', array['344']),
    ('Sêxtuplo', '2º Andar', array['229']),
    ('Séptuplo', '2º Andar', array['228']),
    ('Séptuplo', '3º Andar', array['356']),
    ('Óctuplo', '2º Andar', array['231']),
    ('Casal com Varanda', '2º Andar', array['241','242','243','244']),
    ('Casal com Varanda', '3º Andar', array['36$','367','368','369']),
    ('Triplo com Varanda', '2º Andar', array['225']),
    ('Triplo com Varanda', '3º Andar', array['350','351']),
    ('Quádruplo com Varanda', '2º Andar', array['222','223']),
    ('Quádruplo com Varanda', '3º Andar', array['352']),
    ('Quíntuplo com Varanda', '2º Andar', array['226','227']),
    ('Quíntuplo com Varanda', '3º Andar', array['347','348']),
    ('Sêxtuplo com Varanda', '2º Andar', array['220','221','224']),
    ('Sêxtuplo com Varanda', '3º Andar', array['349']),
    ('Óctuplo com Varanda', '3º Andar', array['346'])
)
insert into rooms (number, category, floor)
select number, category, floor
from room_catalog
cross join lateral unnest(numbers) as number
on conflict (number) do nothing;
