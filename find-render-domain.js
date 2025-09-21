/**
 * Script to help identify your Render domain
 * Run this script after deploying to Render to find your domain
 */

console.log("=== Render Domain Finder ===");
console.log("After deployment, your Render domain will be:");
console.log("- Format: <service-name>.onrender.com");
console.log("- Based on your render.yaml name field");
console.log("");
console.log("In your case, based on render.yaml:");
console.log("Service name: legal-ai-frontend");
console.log("Expected domain: legal-ai-frontend.onrender.com");
console.log("");
console.log("To verify your exact domain:");
console.log("1. Go to https://dashboard.render.com/");
console.log("2. Find your service in the dashboard");
console.log("3. The domain will be displayed on the service page");
console.log("");
console.log("Add this domain to Firebase Console:");
console.log("1. Go to https://console.firebase.google.com/");
console.log("2. Select your project");
console.log("3. Go to Authentication > Settings");
console.log("4. Add your Render domain to 'Authorized domains'");
console.log("5. Save and redeploy your Render service");