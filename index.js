const Plugin = module.parent.require('../Structures/Plugin');

class ThemeManager extends Plugin {
    constructor (...args) {
        super(...args);
        window.DI.DISettings.registerSettingsTab(this, 'Theme Manager', require('./panel.js'));
        this.parseSettings();
        this.loadSnippets();
    }

    parseSettings () {
        if (!this.hasSettings || !Object.keys(this.settings).includes('snippets')) {
            this.setSettingsNode('snippets', '[]');
        }
    }

    get snippets () {
        return JSON.parse(this.settings.snippets);
    }

    loadSnippets () {
        setTimeout(() => {
            if (!window.DI.CssInjector.styleTag) {
                return this.loadSnippets(); // if you're on a slower machine where DI's CSS tag hasn't initialized after 1 second, try again
            }
            this.snippets
                .filter(snippet => snippet.enabled)
                .forEach(snippet => {
                    window.DI.CssInjector.styleTag.innerHTML += snippet.content;
                });
        }, 1000); // give DI's CSS tag some time to initialize
    }

    getSnippet (snippetName) {
        return this.snippets.find(snippet => snippet.name === snippetName);
    }

    deleteSnippet (snippetName) {
        const snippets = this.snippets;
        const snippet = snippets.find(snippet => snippet.name === snippetName);
        const index = snippets.indexOf(snippet);
        snippets.splice(index, 1);
        this.setSettingsNode('snippets', JSON.stringify(snippets));
    }

    toggleSnippet (snippetName) {
        const snippets = this.snippets;
        if (snippets.find(snippet => snippet.name === snippetName).enabled) {
            window.DI.CssInjector.styleTag.innerHTML += snippets.find(snippet => snippet.name === snippetName).content;
        } else {
            window.DI.CssInjector.styleTag.innerHTML = window.DI.CssInjector.styleTag.innerHTML.replace(snippets.find(snippet => snippet.name === snippetName).content, '');
        }
    }
}

module.exports = ThemeManager;