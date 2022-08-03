
import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";

// To be used on app.use(Quasar, { ... })
export default {
    config: {
        brand: {
            primary: '#3EA39F',
            red: '#E36565',
            blue: '#3E5669'
        },
        extras: [
            'material-icons',
            'mdi-v6',
            'ionicons-v4', // last webfont was available in v4.6.3
            'eva-icons',
            'fontawesome-v6',
            'themify',
            'line-awesome',
            'bootstrap-icons'
          ]
    },
    plugins: {
    },

};