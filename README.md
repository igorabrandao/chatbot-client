# Base Angular

This project was generated with [Angular CLI]

## Getting Started

### Prerequisites

* NodeJS
* NPM
* Angular CLI

### Installing

Installing Node (v8.x)
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Installing Angular CLI
```
npm install -g @angular/cli
```
If necessary uses *sudo* before the command

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running in a custom environment

At first, you have to create a file called environment.custom.ts under environment folder

Run `ng server -env custom`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Build Production

Run `ng build -env prod`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

##Troubles

If the webpack watching function does not working on deep files, execute the command bellow:

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```