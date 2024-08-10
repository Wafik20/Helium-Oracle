# Helium-Oracle

Fetch your Helium Hotpot status and rewards without the need for external API or complicated AWS data buckets.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Helium-Oracle is a lightweight tool designed to simplify the process of retrieving status and reward information for Helium Hotspots. By leveraging direct interactions with the Helium blockchain and related services, this tool eliminates the need for external APIs or complex data storage solutions.

## Features

- Fetch real-time hotspot status
- Retrieve IoT and Mobile network rewards
- Simple and easy-to-use interface
- No external API dependencies
- Minimal setup required

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Basic knowledge of JavaScript and Node.js

## Installation

To install Helium-Oracle, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/helium-oracle.git
   ```

2. Navigate to the project directory:
   ```
   cd helium-oracle
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

Here's a basic example of how to use Helium-Oracle:

```javascript
const { getHotspotMetaDataAndRewards } = require('./getRewards');

async function main() {
  try {
    const hotspotId = 'your-hotspot-id-here';
    const result = await getHotspotMetaDataAndRewards(hotspotId);
    console.log('Hotspot Data:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Configuration

To configure Helium-Oracle, you need to set the following environment variables:

- `RPC_URL`: The RPC URL for the Solana network
- `IOT_MINT`: The public key for the IoT mint
- `MOBILE_MINT`: The public key for the Mobile mint

You can set these in a `.env` file in the root of your project:

```
RPC_URL=https://your-rpc-url.com
IOT_MINT=your-iot-mint-public-key
MOBILE_MINT=your-mobile-mint-public-key
```

## Contributing

Contributions to Helium-Oracle are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the original branch: `git push origin feature-branch-name`
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
