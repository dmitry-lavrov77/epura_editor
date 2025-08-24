
import {excel_app} from './excel-app/excel-app'

import {DBLDataSource} from '../middleware/datasource'

import {PLEDataSource} from '../middleware/datasource'


//new excel_app(document.getElementById('epura_editor'), new DBLDataSource())

new excel_app(document.getElementById('epura_editor'), new PLEDataSource('31.44.94.234:63123', 'Surgut'))