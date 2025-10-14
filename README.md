# Discord Bot Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0.0-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)

A modern, feature-rich Discord bot template built with Discord.js v14, TypeScript, and MongoDB. This template provides a solid foundation for building scalable Discord bots with command handlers, event handlers, and database integration.

## ✨ Features

- 🚀 **Modern Stack**: Built with Discord.js v14, TypeScript, and Node.js 20+
- 📂 **Organized Structure**: Clean, modular architecture with separate handlers
- 🎯 **Multiple Command Types**: Support for slash commands, context menu commands, message commands, and component interactions
- 🗃️ **Database Integration**: MongoDB integration with Mongoose
- 🐳 **Docker Support**: Complete Docker setup with MongoDB
- 🔧 **Development Tools**: ESLint, Prettier, and hot reload with Nodemon
- 🌐 **Express API**: Built-in Express server for webhooks and health checks
- 📝 **Comprehensive Logging**: Advanced logging system with colored output
- ⚡ **Multiple Runtimes**: Support for Node.js and Bun
- 🔄 **Auto Command Registration**: Automatic command deployment and registration

## 📋 Table of Contents

- [Discord Bot Template](#discord-bot-template)
  - [✨ Features](#-features)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔧 Prerequisites](#-prerequisites)
  - [🚀 Quick Start](#-quick-start)
  - [📁 Project Structure](#-project-structure)
  - [🎯 Commands](#-commands)
    - [Slash Commands](#slash-commands)
    - [Context Menu Commands](#context-menu-commands)
    - [Message Commands](#message-commands)
    - [Component Commands](#component-commands)
  - [📡 Events](#-events)
  - [🗃️ Database](#️-database)
    - [Models](#models)
    - [Type Safety Features](#type-safety-features)
    - [Connection](#connection)
  - [🐳 Docker Setup](#-docker-setup)
    - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
    - [Using Docker Only](#using-docker-only)
  - [🔐 Environment Variables](#-environment-variables)
  - [💻 Development](#-development)
    - [Hot Reload](#hot-reload)
    - [Code Quality](#code-quality)
    - [Building](#building)
  - [📜 Available Scripts](#-available-scripts)
  - [🛠️ Customization](#️-customization)
    - [Adding New Commands](#adding-new-commands)
    - [Adding New Events](#adding-new-events)
    - [Modifying Bot Configuration](#modifying-bot-configuration)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🆘 Support](#-support)
  - [🙏 Acknowledgments](#-acknowledgments)

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) v20.0.0 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Discord Application](https://discord.com/developers/applications) with bot token

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/discord-bot-template.git
   cd discord-bot-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   # Discord Bot Configuration
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017
   DATABASE_NAME=discord_bot

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Optional: Webhook for logging (optional)
   WEBHOOK_URL=your_webhook_url_here
   ```

4. **Start the bot**
   ```bash
   npm run dev:ts
   # or for production build
   npm run build && npm start
   ```

## 📁 Project Structure

```
discord-bot-template/
├── src/
│   ├── api/                 # Express API routes
│   │   └── app.ts
│   ├── base/                # Base classes and builders
│   │   ├── client.ts        # Extended Discord client
│   │   ├── componentCommandBuilder.ts
│   │   └── messageCommandBuilder.ts
│   ├── commands/            # Command handlers
│   │   ├── application/     # Application commands
│   │   │   ├── contextMenu/ # Context menu commands
│   │   │   └── slash/       # Slash commands
│   │   ├── components/      # Component interactions
│   │   │   ├── buttons/     # Button interactions
│   │   │   ├── modalSubmit/ # Modal submit handlers
│   │   │   └── selectMenus/ # Select menu handlers
│   │   └── messageCommands/ # Message-based commands
│   ├── configs/             # Configuration files
│   │   └── bot.ts          # Bot configuration
│   ├── database/            # Database models and connection
│   │   ├── main.ts         # Database connection
│   │   └── models/         # Mongoose models
│   ├── events/              # Event handlers
│   │   ├── debug/          # Debug events
│   │   └── handlers/       # Event handlers
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── index.ts            # Main entry point
├── assets/                  # Static assets
├── dist/                    # Compiled JavaScript (auto-generated)
├── docker-compose.yaml      # Docker composition
├── Dockerfile              # Docker configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Commands

### Slash Commands

Located in `src/commands/application/slash/`

**Example: Ping Command**

```typescript
import { SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../../utils/create';
import { CommandTypes } from '../../../types/enums';

export const command = createCommand({
  type: CommandTypes.SlashCommand,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addStringOption(option => option.setName('input').setDescription('The input to echo back').setRequired(false)),

  execute: async (client, interaction) => {
    const str = interaction.options.getString('input');
    await interaction.reply(str ? `Pong! ${str}` : 'Pong!');
    return true;
  }
});
```

### Context Menu Commands

Located in `src/commands/application/contextMenu/`

### Message Commands

Located in `src/commands/messageCommands/` - Traditional prefix-based commands

### Component Commands

- **Buttons**: `src/commands/components/buttons/`
- **Modals**: `src/commands/components/modalSubmit/`
- **Select Menus**: `src/commands/components/selectMenus/`

## 📡 Events

Event handlers are located in `src/events/` and automatically loaded:

- `handlers/ready.ts` - Bot ready event
- `handlers/applicationCommands.ts` - Slash command handler
- `handlers/messageCommands.ts` - Message command handler
- `handlers/componentCommands.ts` - Component interaction handler
- `handlers/autoComplete.ts` - Autocomplete handler
- `debug/warn.ts` - Debug warning handler

## 🗃️ Database

This template uses MongoDB with Mongoose for data persistence.

### Models

Located in `src/database/models/`

**Example: Guild Model**

```typescript
import { model, Schema, InferSchemaType } from 'mongoose';

const GuildSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true,
      default: '!'
    }
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true
  }
);

// Infer the TypeScript type from the schema
export type Guild = InferSchemaType<typeof GuildSchema>;

export const GuildModel = model<Guild>('guilds', GuildSchema);
```

### Type Safety Features

- **Schema-First Types**: TypeScript types are automatically inferred from Mongoose schemas using `InferSchemaType`
- **No Type Duplication**: Eliminates the need to manually maintain separate interfaces
- **Compile-Time Safety**: Ensures your TypeScript types always match your database schema
- **Auto-Completion**: Full IntelliSense support for model properties

### Connection

The database connection is automatically established in `src/database/main.ts` using the `MONGO_URI` environment variable.

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

The template includes a complete Docker setup with MongoDB:

```bash
# Start the bot and database
docker-compose up -d

# View logs
docker-compose logs -f bot

# Stop services
docker-compose down
```

### Using Docker Only

```bash
# Build the image
docker build -t discord-bot .

# Run the container
docker run -d --env-file .env -p 3000:3000 discord-bot
```

## 🔐 Environment Variables

| Variable            | Required | Description                        | Default       |
| ------------------- | -------- | ---------------------------------- | ------------- |
| `DISCORD_BOT_TOKEN` | ✅       | Your Discord bot token             | -             |
| `DISCORD_CLIENT_ID` | ✅       | Your Discord application client ID | -             |
| `MONGO_URI`         | ✅       | MongoDB connection string          | -             |
| `DATABASE_NAME`     | ✅       | MongoDB database name              | -             |
| `PORT`              | ✅       | Express server port                | -             |
| `NODE_ENV`          | ✅       | Environment mode                   | `development` |
| `WEBHOOK_URL`       | ❌       | Discord webhook for logging        | `null`        |

## 💻 Development

### Hot Reload

For development with automatic reloading:

```bash
npm run dev:ts
```

### Code Quality

The project includes ESLint and Prettier for code quality:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building

```bash
# Clean previous build
npm run clean

# Compile TypeScript
npm run compile

# Build (clean + compile)
npm run build
```

## 📜 Available Scripts

| Script             | Description                         |
| ------------------ | ----------------------------------- |
| `npm start`        | Start the compiled bot              |
| `npm run dev`      | Build and start the bot             |
| `npm run dev:ts`   | Start with hot reload (development) |
| `npm run bun`      | Start with Bun runtime              |
| `npm run bun:ts`   | Start with Bun runtime (TypeScript) |
| `npm run build`    | Clean and compile TypeScript        |
| `npm run clean`    | Remove compiled files               |
| `npm run compile`  | Compile TypeScript only             |
| `npm run format`   | Format code with Prettier           |
| `npm run lint`     | Check code with ESLint              |
| `npm run lint:fix` | Fix ESLint issues                   |

## 🛠️ Customization

### Adding New Commands

1. Create a new file in the appropriate command directory
2. Use the `createCommand` utility function
3. Export the command object
4. The command will be automatically loaded

### Adding New Events

1. Create a new file in `src/events/`
2. Follow the existing event handler pattern
3. The event will be automatically registered

### Modifying Bot Configuration

Edit `src/configs/bot.ts` to modify:

- Command prefix for message commands
- Developer user IDs
- Other bot-specific settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

1. Check the [Discord.js Guide](https://discordjs.guide/)
2. Visit the [Discord.js Documentation](https://discord.js.org/#/docs)
3. Join the [Discord.js Discord Server](https://discord.gg/djs)

Open an issue on GitHub if you find a bug or have a feature request.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - The Discord API library
- [TypeScript](https://www.typescriptlang.org/) - Type safety and modern JavaScript features
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Express](https://expressjs.com/) - Web framework for the API
