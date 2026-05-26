# 🚀 Space Mission Control — Controle de Missão Espacial

> **Global Solution FIAP 2026.1**
> Disciplina: Advanced Programming And Mobile Dev (3EC)
> Tema: Space Connect — Tecnologia Espacial Aplicada a Desafios Reais

---

## 👥 Integrantes

| Nome | RM |
|------|----|
| Celso Fernando Ferrer Singh | RM565643 |
| Vitor Saccardo da Silva | RM555611 |
| Ana Luíza Oliveira Dourado | RM558793 |

---

## 📌 Descrição do Projeto

Sistema integrado de **Controle de Missão Espacial** composto por:

- **Backend REST API** desenvolvida em Java com Spring Boot, com persistência em banco H2 (modo arquivo)
- **Aplicativo Mobile** desenvolvido em React Native com TypeScript (Expo)

A solução permite monitorar e registrar em tempo real os dados críticos de uma missão espacial: sensores e módulos computacionais, eventos operacionais e alertas críticos — alinhado ao tema da Global Solution 2026.1 da FIAP (Space Connect).

---

## 🗂️ Estrutura do Repositório

```
GS_mobiledev/
├── space-mission-api/        # Backend Spring Boot
│   ├── pom.xml
│   └── src/
│       └── main/java/br/com/fiap/spacemission/
│           ├── model/         # Entidades JPA
│           ├── repository/    # Spring Data Repositories
│           ├── service/       # Regras de negócio
│           ├── controller/    # Endpoints REST
│           └── config/        # CORS e exception handler
└── space-mission-app/        # App React Native (Expo)
    ├── App.tsx                # Navegação principal
    └── src/
        ├── screens/           # Telas do app
        ├── services/          # Chamadas à API (axios)
        └── types/             # Tipos TypeScript
```

---

## ⚙️ Backend — Spring Boot API

### Tecnologias
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- Banco H2 (modo arquivo — persiste em `./data/spacemissiondb`)
- Lombok
- Bean Validation

### Pré-requisitos

- **Java 17+** (obrigatório para Spring Boot 3.x)
  - Verifique: `java -version`
  - Instalar via Homebrew: `brew install openjdk@17`

### Como executar

**Opção 1 — Maven Wrapper (automático, sem instalar Maven):**
```bash
cd space-mission-api
chmod +x mvnw
./mvnw spring-boot:run
```

**Opção 2 — Maven instalado localmente:**
```bash
# Instalar Maven (se necessário): brew install maven
cd space-mission-api
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080`

O **H2 Console** pode ser acessado em `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/spacemissiondb`
- Username: `sa`
- Password: *(em branco)*

---

## 📡 Endpoints da API

### Sensores (`/api/sensores`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/sensores` | Lista todos os sensores |
| `GET` | `/api/sensores?status=ATIVO` | Filtra por status |
| `GET` | `/api/sensores?modulo=PROPULSAO` | Filtra por módulo |
| `GET` | `/api/sensores/{id}` | Busca sensor por ID |
| `POST` | `/api/sensores` | Cadastra novo sensor |
| `PUT` | `/api/sensores/{id}` | Atualiza sensor |
| `DELETE` | `/api/sensores/{id}` | Remove sensor |

**Exemplo POST `/api/sensores`:**
```json
{
  "nome": "Sensor de Temperatura Principal",
  "tipo": "TEMPERATURA",
  "modulo": "MODULO_PROPULSAO",
  "status": "ATIVO",
  "ultimaLeitura": 87.3,
  "unidade": "°C",
  "localizacao": "Compartimento de propulsão"
}
```

---

### Eventos Operacionais (`/api/eventos`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/eventos` | Lista todos os eventos |
| `GET` | `/api/eventos?tipo=CRITICO` | Filtra por tipo |
| `GET` | `/api/eventos?sistema=PROPULSAO` | Filtra por sistema |
| `GET` | `/api/eventos?faseMissao=ORBITA` | Filtra por fase |
| `GET` | `/api/eventos/{id}` | Busca evento por ID |
| `POST` | `/api/eventos` | Registra novo evento |
| `DELETE` | `/api/eventos/{id}` | Remove evento |

**Exemplo POST `/api/eventos`:**
```json
{
  "sistema": "NAVEGACAO",
  "descricao": "Ajuste de trajetória orbital realizado com sucesso",
  "tipo": "NORMAL",
  "operador": "Celso Singh",
  "faseMissao": "ORBITA",
  "duracaoSegundos": 45
}
```

---

### Alertas Críticos (`/api/alertas`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/alertas` | Lista todos os alertas |
| `GET` | `/api/alertas/nao-resolvidos` | Lista alertas pendentes |
| `GET` | `/api/alertas?nivel=CRITICO` | Filtra por nível |
| `GET` | `/api/alertas/{id}` | Busca alerta por ID |
| `POST` | `/api/alertas` | Registra novo alerta |
| `PATCH` | `/api/alertas/{id}/resolver` | Marca como resolvido |
| `DELETE` | `/api/alertas/{id}` | Remove alerta |

**Exemplo POST `/api/alertas`:**
```json
{
  "nivel": "CRITICO",
  "mensagem": "Temperatura do motor de propulsão acima do limite crítico",
  "sistemaOrigem": "SENSOR_TEMP_MOTOR_01",
  "codigoAlerta": "ERR_TEMP_001",
  "valorDetectado": 98.5,
  "valorLimite": 85.0
}
```

**Exemplo PATCH `/api/alertas/1/resolver`:**
```json
{
  "resolucao": "Motor resfriado por sistema auxiliar. Temperatura normalizada."
}
```

---

## 📱 App Mobile — React Native

### Tecnologias
- React Native com Expo (~51)
- TypeScript
- React Navigation (Bottom Tabs)
- Axios

### Telas

| Tela | Descrição |
|------|-----------|
| **Dashboard** | Visão geral da missão: totais, alertas críticos e eventos recentes |
| **Sensores** | Lista de sensores com status; formulário para cadastrar novos (POST) |
| **Eventos** | Histórico de eventos operacionais; formulário para registrar (POST) |
| **Alertas** | Lista de alertas com filtro por pendentes; resolver alertas (PATCH) |

### Como executar

```bash
cd space-mission-app
npm install
npx expo start
```

> **Importante:** Ajuste a constante `BASE_URL` em `src/services/api.ts`:
> - Emulador Android: `http://10.0.2.2:8080/api`
> - Dispositivo físico: `http://<IP_DA_MAQUINA>:8080/api`
> - iOS Simulator: `http://localhost:8080/api`

---

## 🌐 Contexto — Global Solution FIAP 2026.1

O tema **Space Connect** propõe soluções que usem tecnologia, dados e inovação para resolver desafios da Terra e ampliar possibilidades da economia espacial. Este projeto simula um **centro de controle de missão**, onde operadores monitoram sensores críticos, registram eventos durante a missão e respondem a alertas — situação real em missões orbitais como as operadas pela NASA, ESA e empresas como a Visiona.

---

*Global Solution 2026.1 — FIAP — Engenharia da Computação — 3º Ano*
