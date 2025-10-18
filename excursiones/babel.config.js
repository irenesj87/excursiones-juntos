// babel.config.js
module.exports = {
    presets: [
        // Tus otros presets, como @babel/preset-env, @babel/preset-react, etc.
        // Por ejemplo, en un proyecto Create React App sería 'babel-preset-react-app'
        "babel-preset-react-app",
    ],
    plugins: [
        // Añade el plugin de React Compiler aquí
        "babel-plugin-react-compiler",
    ],
};
