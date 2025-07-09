
import {excel_app} from './excel-app/excel-app'

import {DBLDataSource} from '../middleware/datasource'


new excel_app(document.getElementById('epura_editor'), new DBLDataSource())