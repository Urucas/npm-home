#!/usr/bin/env node
'use strict';
const meow = require('meow');
const readPkgUp = require('read-pkg-up');
const opn = require('opn');
const inquirer = require('inquirer');

var cli = meow(`
	Usage
	  $ npm-home
	  $ nh
	Options
	  -l, -list Show package dependencies
`, {
	alias: {
		l: 'list'
	}
});

function open(pkg) {
	opn(`https://www.npmjs.com/package/${pkg}`, {wait: false});
}

function prompt(pkg, dependencies, devDependencies) {
	var pkgs = [pkg]
	for(var key in dependencies) pkgs.push(key)
	for(var key in devDependencies) pkgs.push(key)
	inquirer.prompt({
		type: 'list',
		name: 'pkg',
		message: 'Choice a package',
		choices: pkgs,
		default: [pkg]
	}, function(answer){
		open(answer.pkg)
	})
}

readPkgUp().then(result => {
	if(cli.flags.l || cli.flags.list) {
		prompt(result.pkg.name, result.pkg.dependencies || {}, result.pkg.devDependencies || {})
	}else
		open(result.pkg.name)
});
