const { SettingsOptionButton, SettingsOptionTitle, SettingsDescription, SettingsOptionDescription, SettingsExpandableSection, SettingsOptionFilebox } = window.DI.require('./Structures/Components');
const { SettingsSnippetToggle, SettingsDivider } = require('./Structures');
const e = window.DI.React.createElement;

let snippetCreatorElement;

class ThemeManagerSettingsPanel extends window.DI.React.Component {
    render () {
        const themes = [
            e(SettingsOptionDescription, {
                text: 'Default Discord (no custom CSS)',
                extra: [e(SettingsOptionButton, {
                    outline: false,
                    text: 'Apply',
                    onClick: () => { window.DI.CssInjector.set(window._path.join(__dirname, 'emptyCSS.css')); }
                }), e(SettingsDivider)]
            })
        ];

        try {
            const files = window._fs.readdirSync(this.props.plugin.settings.dirPath);
            files.map(filename => {
                if (!filename.endsWith('.css')) {
                    return;
                }
                themes.push(
                    e(SettingsOptionDescription, {
                        text: filename.replace('.css', ''),
                        extra: [e(SettingsOptionButton, {
                            outline: false,
                            text: 'Apply',
                            onClick: () => { window.DI.CssInjector.set(window._path.join(this.props.plugin.settings.dirPath, filename)); }
                        }), filename !== files[files.length - 1] ? e(SettingsDivider) : null]
                    }));
            });
        } catch (err) {
            if (err.message.includes('no such file or directory')) {
                themes.push(
                    e(SettingsDescription, { text: 'Warning: The specified folder wasn\'t found. Please select a folder with at least one .css theme file inside it.' })
                );
            }
        }

        if (!themes[1]) {
            themes.push(
                e(SettingsDescription, { text: 'Warning: No themes found in the specified folder. Please select a folder with at least one .css file inside it.' })
            );
        }

        /* Custom snippets */

        const snippetCreator = (bool, snippetName) => {
            let editedSnippet = true;
            let oldSnippetContents;
            if (!snippetName) {
                snippetName = '';
                editedSnippet = false;
            } else {
                oldSnippetContents = this.props.plugin.getSnippet(snippetName).content;
            }
            if (bool) {
                snippetCreatorElement = e('div', {},
                    editedSnippet ? e(SettingsOptionTitle, { text: 'Edit an old snippet' }) : e(SettingsOptionTitle, { text: 'Add a new snippet' }),
                    e(SettingsOptionDescription, {
                        text: e('p', { style: { color: 'white' } }, 'Put the name of your custom snippet here:'),
                        extra: [
                            e('input', {
                                className: 'inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q',
                                type: 'text',
                                id: 'ThemeMGR_CSSName',
                                defaultValue: snippetName,
                                style: { flex: '1 1 auto', display: 'inline-block' }
                            })
                        ]
                    }),

                    e(SettingsOptionDescription, {
                        text: e('p', { style: { color: 'white' } }, 'Put your CSS code here:'),
                        extra: [
                            e('div', { height: '1px', width: '1px', style: { backgroundColor: 'white' } },
                                e('textarea', { id: 'ThemeMGR_CSSTextArea', style: { height: '100px', minWidth: '100%', maxWidth: '100%' } }, oldSnippetContents)
                            )
                        ]
                    }),

                    e(SettingsOptionButton, {
                        text: 'Save',
                        onClick: () => {
                            const snippets = this.props.plugin.snippets;
                            const snippet = {
                                name: document.getElementById('ThemeMGR_CSSName').value,
                                content: document.getElementById('ThemeMGR_CSSTextArea').value,
                                enabled: false
                            };
                            if (!snippets[0]) {
                                this.props.plugin.setSettingsNode('snippets', JSON.stringify([snippet]));
                            } else {
                                snippets.push(snippet);
                                this.props.plugin.setSettingsNode('snippets', JSON.stringify(snippets));
                            }
                            snippetCreator(false);
                        }
                    })
                );
            } else {
                snippetCreatorElement = undefined;
            }

            if (editedSnippet) {
                this.props.plugin.deleteSnippet(snippetName);
            }
            this.forceUpdate();
        };

        if (snippetCreatorElement) {
            return snippetCreatorElement;
        }

        const addButton = e(SettingsOptionButton, {
            onClick: () => { snippetCreator(true); },
            text: 'Add New Snippet'
        });

        const snippetToggles = [];
        const snippets = this.props.plugin.snippets;
        snippets.forEach(snippet => {
            snippetToggles.push(
                e(SettingsSnippetToggle, {
                    onDelete: () => {
                        this.forceUpdate();
                    },
                    onEdit: () => {
                        snippetCreator(true, snippet.name);
                        this.forceUpdate();
                    },
                    title: snippet.name,
                    default: false,
                    plugin: this.props.plugin,
                    extra: [e(SettingsDivider)]
                })
            );
        });


        return e('div', {},
            e(SettingsOptionDescription, {
                text: 'Settings for Theme Manager'
            }),

            e(SettingsDivider),

            e(SettingsOptionFilebox, {
                title: 'Path to folder of CSS files',
                description: 'This is the path to your folder of themes. Place all of your .css files in this folder.',
                plugin: this.props.plugin,
                lsNode: 'dirPath',
                defaultValue: window._path.join(__dirname, 'Themes'),
                reset: true,
                apply: true,
                buttonName: 'Choose a folder...',
                dialog: {
                    title: 'Choose a folder...',
                    filters: [],
                    properties: ['openDirectory', 'createDirectory']
                },
                onApply: () => { this.forceUpdate(); }
            }),

            e(SettingsExpandableSection, {
                title: 'Themes',
                components: themes
            }),

            e(SettingsExpandableSection, {
                title: 'Custom CSS',
                components: snippetToggles.concat(addButton)
            })
        );
    }
}

module.exports = ThemeManagerSettingsPanel;