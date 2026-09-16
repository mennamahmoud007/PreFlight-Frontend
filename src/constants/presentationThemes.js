const defaultTheme = {
    name: 'Prelight Core',

    colors: {
        background: '#080D18',
        surface: '#0D1424',
        surfaceAlt: '#111B2D',
        accent: '#5DA9FF',
        accentSoft: '#8CCBFF',
        text: '#F2F6FC',
        muted: '#AEBBD0',
        line: '#26344A',
    },

    grid: 'rgba(93, 169, 255, 0.035)',

    motif: 'grid',
    coverStyle: 'prelight',
};


const presentationThemes = {

    'EdTech': {
        name: 'Learning',

        colors: {
            background: '#0B1020',
            surface: '#111A2E',
            surfaceAlt: '#182640',
            accent: '#5B8DEF',
            accentSoft: '#AFC7FF',
            text: '#F4F7FC',
            muted: '#B2C0D6',
            line: '#304360',
        },

        grid: 'rgba(91, 141, 239, 0.035)',

        motif: 'grid',
        coverStyle: 'editorial',
    },


    'FinTech': {
        name: 'Financial',

        colors: {
            background: '#09140F',
            surface: '#102018',
            surfaceAlt: '#172D23',
            accent: '#35C78A',
            accentSoft: '#9BE8C6',
            text: '#F2FBF7',
            muted: '#A8C1B6',
            line: '#2D4A3D',
        },

        grid: 'rgba(53, 199, 138, 0.03)',

        motif: 'chart',
        coverStyle: 'data',
    },


    'HealthTech': {
        name: 'Clinical',

        colors: {
            background: '#09111D',
            surface: '#0F1B2A',
            surfaceAlt: '#16273A',
            accent: '#4FC3F7',
            accentSoft: '#B7E8FF',
            text: '#F4FAFF',
            muted: '#ADBFCE',
            line: '#29445A',
        },

        grid: 'rgba(79, 195, 247, 0.03)',

        motif: 'medical',
        coverStyle: 'clinical',
    },


    'HR Tech': {
        name: 'People',

        colors: {
            background: '#120F1A',
            surface: '#1B1626',
            surfaceAlt: '#28203A',
            accent: '#A78BFA',
            accentSoft: '#D8CCFF',
            text: '#F9F7FF',
            muted: '#C0B7D0',
            line: '#463858',
        },

        grid: 'rgba(167, 139, 250, 0.03)',

        motif: 'nodes',
        coverStyle: 'human',
    },


    'Developer Tools': {
        name: 'Developer',

        colors: {
            background: '#080C10',
            surface: '#10171D',
            surfaceAlt: '#17232B',
            accent: '#79E2B8',
            accentSoft: '#B8F4DA',
            text: '#F1FAF6',
            muted: '#ABBFB6',
            line: '#30453C',
        },

        grid: 'rgba(121, 226, 184, 0.03)',

        motif: 'terminal',
        coverStyle: 'terminal',
    },


    'E-commerce': {
        name: 'Commerce',

        colors: {
            background: '#15100D',
            surface: '#201714',
            surfaceAlt: '#2D211B',
            accent: '#FF8A4C',
            accentSoft: '#FFC09E',
            text: '#FFF8F4',
            muted: '#C9B8AE',
            line: '#4D3A30',
        },

        grid: 'rgba(255, 138, 76, 0.03)',

        motif: 'blocks',
        coverStyle: 'commerce',
    },


    'SaaS / B2B': {
        name: 'Business',

        colors: {
            background: '#0A1019',
            surface: '#121B27',
            surfaceAlt: '#192839',
            accent: '#6E9FFF',
            accentSoft: '#B6CEFF',
            text: '#F4F7FC',
            muted: '#AEBCCE',
            line: '#2F4158',
        },

        grid: 'rgba(110, 159, 255, 0.03)',

        motif: 'columns',
        coverStyle: 'business',
    },


    'Consumer Social': {
        name: 'Social',

        colors: {
            background: '#140C17',
            surface: '#1D1221',
            surfaceAlt: '#2B1930',
            accent: '#F06CBE',
            accentSoft: '#FFB7E4',
            text: '#FFF6FC',
            muted: '#CDB8C7',
            line: '#513647',
        },

        grid: 'rgba(240, 108, 190, 0.03)',

        motif: 'orbit',
        coverStyle: 'social',
    },


    'Marketplace': {
        name: 'Marketplace',

        colors: {
            background: '#11100D',
            surface: '#191814',
            surfaceAlt: '#27251B',
            accent: '#DDB84F',
            accentSoft: '#F4D98A',
            text: '#FCF9EF',
            muted: '#C5BEA9',
            line: '#484333',
        },

        grid: 'rgba(221, 184, 79, 0.03)',

        motif: 'network',
        coverStyle: 'exchange',
    },


    'EdTech / Social': {
        name: 'Campus',

        colors: {
            background: '#091217',
            surface: '#102026',
            surfaceAlt: '#173139',
            accent: '#35B8AE',
            accentSoft: '#9DE6DF',
            text: '#F2FBFA',
            muted: '#AEC5C7',
            line: '#2E4C50',
        },

        grid: 'rgba(53, 184, 174, 0.03)',

        motif: 'campus',
        coverStyle: 'campus',
    },


    'CleanTech': {
        name: 'Sustainability',

        colors: {
            background: '#0B120C',
            surface: '#131E14',
            surfaceAlt: '#1C2B1E',
            accent: '#A6C94A',
            accentSoft: '#D2E89B',
            text: '#F6FAF1',
            muted: '#BBC6B2',
            line: '#394631',
        },

        grid: 'rgba(166, 201, 74, 0.03)',

        motif: 'leaf',
        coverStyle: 'organic',
    },


    'Logistics': {
        name: 'Logistics',

        colors: {
            background: '#11100D',
            surface: '#1B1914',
            surfaceAlt: '#29251C',
            accent: '#F2A94E',
            accentSoft: '#FFD394',
            text: '#FFF9F1',
            muted: '#C7BCAB',
            line: '#4A4132',
        },

        grid: 'rgba(242, 169, 78, 0.03)',

        motif: 'route',
        coverStyle: 'route',
    },

};
function getPresentationTheme(industry) {
     return presentationThemes[industry] ?? defaultTheme; 
    } 
     export { defaultTheme, presentationThemes, getPresentationTheme, };