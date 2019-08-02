module.exports = {
    default: `--format-options '{"snippetInterface": "synchronous"}'`,
    config : {
        capabilities: [
            {
                'browserName': 'Chrome',                
                'browserstack.use_w3c': true,
                'bstack:options': {
                    'os': 'Windows',
                    'osVersion': '7',
                    'sessionName': 'local_test',
                    'buildName': 'cucumber-js-browserstack',
                    'projectName': 'bip39split',
                    'debug': true,
                    'local': true
                },
            }
        ]
    }
}