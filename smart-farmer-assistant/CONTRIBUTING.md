# Contributing to Smart Farmer Assistant

First off, thank you for considering contributing to Smart Farmer Assistant! It's people like you that make Smart Farmer Assistant such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript/CSS styleguides
* End all files with a newline
* Document new code based on the Documentation Styleguide

## Development Setup

1. Fork and clone the repository
   ```bash
   git clone https://github.com/yourusername/smart-farmer-assistant.git
   cd smart-farmer-assistant
   ```

2. Install dependencies
   ```bash
   npm run install-all
   ```

3. Create a branch for your feature
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. Set up environment variables
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

5. Start the development servers
   ```bash
   npm run dev
   ```

6. Make your changes
   - Write clear, commented code
   - Update tests as needed
   - Update documentation

7. Commit with clear messages
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

8. Push to your fork
   ```bash
   git push origin feature/amazing-feature
   ```

9. Open a Pull Request

## Styleguides

### JavaScript Style Guide

* Use 2 spaces for indentation
* Use semicolons at the end of statements
* Use single quotes for strings
* Use arrow functions where possible
* Keep lines under 100 characters when practical
* Add JSDoc comments for functions
* Use meaningful variable and function names

Example:
```javascript
/**
 * Calculate total investment with interest
 * @param {number} principal - Initial investment
 * @param {number} rate - Interest rate per annum
 * @returns {number} Total amount after interest
 */
const calculateInvestment = (principal, rate) => {
  return principal * (1 + rate / 100);
};
```

### Commit Message Guide

Use the conventional commits format:

```
type(scope): subject

body

footer
```

Types:
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that don't affect code meaning
* **refactor**: Code change that neither fixes a bug nor adds a feature
* **perf**: Change that improves performance
* **test**: Adding or updating tests
* **chore**: Changes to build process, dependencies, or tools

Example:
```
feat(crop-recommendation): add irrigation advice based on humidity

- Added new weather metric tracking
- Integrated with irrigation recommendation logic
- Added tests for edge cases

Closes #123
```

### React Component Style Guide

* Use functional components with hooks
* Use descriptive component names (PascalCase)
* Keep components small and focused
* Lift state up when needed
* Use custom hooks for reusable logic
* Add PropTypes or TypeScript for type safety

Example:
```jsx
/**
 * Displays farmer's current balance
 * @component
 * @param {Object} props
 * @param {number} props.balance - Current farm balance in rupees
 * @param {string} [props.currency='₹'] - Currency symbol
 * @returns {React.ReactElement}
 */
const BalanceCard = ({ balance, currency = '₹' }) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3>Current Balance</h3>
      <p className="text-3xl font-bold">{currency}{balance}</p>
    </div>
  );
};
```

### CSS/Tailwind Guide

* Use Tailwind utility classes as primary styling
* Avoid custom CSS unless necessary
* Keep color scheme consistent with design
* Use responsive classes for mobile-first design
* Test on mobile devices (320px and up)

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Keep test coverage above 80%

```bash
npm test
```

## Documentation

* Update README.md if adding features
* Add comments to complex logic
* Update SETUP.md for setup/deployment changes
* Use clear, beginner-friendly language

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `wontfix` - This will not be worked on

## Questions?

Don't hesitate to ask questions. The community is here to help!

---

Thank you for contributing! 🌾
