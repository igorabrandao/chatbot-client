export class AppConstants {

    public static APP_VERSION = '1.13.3';

    public static APP_YEAR = '2019';

    public static APP_NAME = 'WebFarma - Painel';

    public static ACCESS_LEVEL = {
        sysAdmin: 1,
        companyAdmin: 2,
        delivery: 3,
    };

    public static USER_ACCESS = [false, 'Administrador', 'Gestor de Empresa', 'Entregador', 'Consumidor'];

    public static USER_ACCESS_OBJECTS = [
        {name: 'Administrador', id: 1},
        {name: 'Gestor de Empresa', id: 2},
        {name: 'Entregador', id: 3},
    ];
}
