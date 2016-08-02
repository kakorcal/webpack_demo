# Webpack Demo
Webpack configuration example inspired by https://github.com/survivejs-demos/webpack-demo

It becomes necessary to split it up per environment so that you have enough control over the build result:

Maintain configuration within a single file and branch there. If we trigger a script through npm (i.e., npm run test), npm sets this information in an environment variable. We can match against it and return the configuration we want.