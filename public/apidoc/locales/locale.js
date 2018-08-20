define([
    'public/apidoc/locales/ca.js',
    'public/apidoc/locales/de.js',
    'public/apidoc/locales/es.js',
    'public/apidoc/locales/fr.js',
    'public/apidoc/locales/it.js',
    'public/apidoc/locales/nl.js',
    'public/apidoc/locales/pl.js',
    'public/apidoc/locales/pt_br.js',
    'public/apidoc/locales/ru.js',
    'public/apidoc/locales/zh.js',
    'public/apidoc/locales/zh_cn.js'
], function() {
    var langId = (navigator.language || navigator.userLanguage).toLowerCase().replace('-', '_');
    var language = langId.substr(0, 2);
    var locales = {};

    for (index in arguments) {
        for (property in arguments[index])
            locales[property] = arguments[index][property];
    }
    if ( ! locales['en'])
        locales['en'] = {};

    if ( ! locales[langId] && ! locales[language])
        language = 'en';

    var locale = (locales[langId] ? locales[langId] : locales[language]);

    function __(text) {
        var index = locale[text];
        if (index === undefined)
            return text;
        return index;
    };

    function setLanguage(language) {
        locale = locales[language];
    }

    return {
        __         : __,
        locales    : locales,
        locale     : locale,
        setLanguage: setLanguage
    };
});
