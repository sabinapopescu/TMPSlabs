

## 🏃 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Start the Server
```bash
npm start
```

Your browser will automatically open to `http://localhost:3000`

## 🎓 Alternative: Development Mode

For continuous development with auto-compilation:
```bash
npm run dev
```

This will:
- Watch for TypeScript changes
- Auto-compile on save
- Serve the application on port 3000



## 🎮 How to Use

### Building a Bouquet
1. Fill in bouquet name
2. Select flower details (type, color, quantity, price)
3. Click "Add Flower Line" (you can add multiple)
4. Configure wrapping and ribbon
5. Add optional card message
6. Click "Build Bouquet"

### Using Templates
- Click any template card to instantly load a pre-configured bouquet
- Modify as needed and rebuild

### Changing Settings
- Switch currency (EUR/USD)
- Change language (EN/RO)
- Select delivery method
- Settings save automatically

### Processing Payment
1. Build a bouquet first
2. Select payment method
3. Fill in payment details
4. Click "Process Payment"

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Option 1: Kill the process
lsof -ti:3000 | xargs kill

# Option 2: Use a different port
npx http-server public -p 8080
```

### TypeScript compilation errors?
```bash
# Clean and rebuild
npm run clean
npm run build
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```


See `README.md` for detailed explanations of each pattern.

