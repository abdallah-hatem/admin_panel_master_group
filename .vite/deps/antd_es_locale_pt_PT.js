import {
  commonLocale
} from "./chunk-N77XPGZE.js";
import {
  _objectSpread2
} from "./chunk-IJSSJBZ4.js";
import "./chunk-EQCVQC35.js";

// node_modules/rc-pagination/es/locale/pt_PT.js
var locale = {
  // Options
  items_per_page: "/ página",
  jump_to: "Saltar",
  jump_to_confirm: "confirmar",
  page: "Página",
  // Pagination
  prev_page: "Página Anterior",
  next_page: "Página Seguinte",
  prev_5: "Recuar 5 Páginas",
  next_5: "Avançar 5 Páginas",
  prev_3: "Recuar 3 Páginas",
  next_3: "Avançar 3 Páginas",
  page_size: "mărimea paginii"
};
var pt_PT_default = locale;

// node_modules/rc-picker/es/locale/pt_PT.js
var locale2 = _objectSpread2(_objectSpread2({}, commonLocale), {}, {
  locale: "pt_PT",
  today: "Hoje",
  now: "Agora",
  backToToday: "Hoje",
  ok: "OK",
  clear: "Limpar",
  month: "Mês",
  year: "Ano",
  timeSelect: "Selecionar hora",
  dateSelect: "Selecionar data",
  monthSelect: "Selecionar mês",
  yearSelect: "Selecionar ano",
  decadeSelect: "Selecionar década",
  dateFormat: "D/M/YYYY",
  dateTimeFormat: "D/M/YYYY HH:mm:ss",
  previousMonth: "Mês anterior (PageUp)",
  nextMonth: "Mês seguinte (PageDown)",
  previousYear: "Ano anterior (Control + left)",
  nextYear: "Ano seguinte (Control + right)",
  previousDecade: "Década anterior",
  nextDecade: "Década seguinte",
  previousCentury: "Século anterior",
  nextCentury: "Século seguinte",
  shortWeekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
});
var pt_PT_default2 = locale2;

// node_modules/antd/es/time-picker/locale/pt_PT.js
var locale3 = {
  placeholder: "Hora"
};
var pt_PT_default3 = locale3;

// node_modules/antd/es/date-picker/locale/pt_PT.js
var locale4 = {
  lang: Object.assign(Object.assign({}, pt_PT_default2), {
    placeholder: "Data",
    rangePlaceholder: ["Data inicial", "Data final"],
    today: "Hoje",
    now: "Agora",
    backToToday: "Hoje",
    ok: "OK",
    clear: "Limpar",
    month: "Mês",
    year: "Ano",
    timeSelect: "Hora",
    dateSelect: "Selecionar data",
    monthSelect: "Selecionar mês",
    yearSelect: "Selecionar ano",
    decadeSelect: "Selecionar década",
    yearFormat: "YYYY",
    dateFormat: "D/M/YYYY",
    dayFormat: "D",
    dateTimeFormat: "D/M/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: false,
    previousMonth: "Mês anterior (PageUp)",
    nextMonth: "Mês seguinte (PageDown)",
    previousYear: "Ano anterior (Control + left)",
    nextYear: "Ano seguinte (Control + right)",
    previousDecade: "Última década",
    nextDecade: "Próxima década",
    previousCentury: "Último século",
    nextCentury: "Próximo século"
  }),
  timePickerLocale: Object.assign(Object.assign({}, pt_PT_default3), {
    placeholder: "Hora"
  })
};
var pt_PT_default4 = locale4;

// node_modules/antd/es/calendar/locale/pt_PT.js
var pt_PT_default5 = pt_PT_default4;

// node_modules/antd/es/locale/pt_PT.js
var typeTemplate = "${label} não é um ${type} válido";
var localeValues = {
  locale: "pt",
  Pagination: pt_PT_default,
  DatePicker: pt_PT_default4,
  TimePicker: pt_PT_default3,
  Calendar: pt_PT_default5,
  global: {
    placeholder: "Por favor escolha"
  },
  Table: {
    filterTitle: "Filtro",
    filterConfirm: "Aplicar",
    filterReset: "Reiniciar",
    filterEmptyText: "Sem filtros",
    filterCheckall: "Selecionar todos os itens",
    filterSearchPlaceholder: "Pesquisar nos filtros",
    emptyText: "Sem conteúdo",
    selectAll: "Selecionar página atual",
    selectInvert: "Inverter seleção",
    sortTitle: "Ordenação",
    selectNone: "Apagar todo o conteúdo",
    selectionAll: "Selecionar todo o conteúdo",
    expand: "Expandir linha",
    collapse: "Colapsar linha",
    triggerDesc: "Clique organiza por descendente",
    triggerAsc: "Clique organiza por ascendente",
    cancelSort: "Clique para cancelar organização"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancelar",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancelar"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Procurar...",
    itemUnit: "item",
    itemsUnit: "itens",
    remove: "Remover",
    selectCurrent: "Selecionar página atual",
    removeCurrent: "Remover página atual",
    selectAll: "Selecionar tudo",
    removeAll: "Remover tudo",
    selectInvert: "Inverter a página actual"
  },
  Upload: {
    uploading: "A carregar...",
    removeFile: "Remover",
    uploadError: "Erro ao carregar",
    previewFile: "Pré-visualizar",
    downloadFile: "Baixar"
  },
  Empty: {
    description: "Sem resultados"
  },
  Icon: {
    icon: "ícone"
  },
  Text: {
    edit: "editar",
    copy: "copiar",
    copied: "copiado",
    expand: "expandir"
  },
  Form: {
    optional: "(opcional)",
    defaultValidateMessages: {
      default: "Erro ${label} na validação de campo",
      required: "Por favor, insira ${label}",
      enum: "${label} deve ser um dos seguinte: [${enum}]",
      whitespace: "${label} não pode ser um carácter vazio",
      date: {
        format: " O formato de data ${label} é inválido",
        parse: "${label} não pode ser convertido para uma data",
        invalid: "${label} é uma data inválida"
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate
      },
      string: {
        len: "${label} deve possuir ${len} caracteres",
        min: "${label} deve possuir ao menos ${min} caracteres",
        max: "${label} deve possuir no máximo ${max} caracteres",
        range: "${label} deve possuir entre ${min} e ${max} caracteres"
      },
      number: {
        len: "${label} deve ser igual à ${len}",
        min: "O valor mínimo de ${label} é ${min}",
        max: "O valor máximo de ${label} é ${max}",
        range: "${label} deve estar entre ${min} e ${max}"
      },
      array: {
        len: "Deve ser ${len} ${label}",
        min: "No mínimo ${min} ${label}",
        max: "No máximo ${max} ${label}",
        range: "A quantidade de ${label} deve estar entre ${min} e ${max}"
      },
      pattern: {
        mismatch: "${label} não se enquadra no padrão ${pattern}"
      }
    }
  },
  Image: {
    preview: "Pré-visualização"
  }
};
var pt_PT_default6 = localeValues;
export {
  pt_PT_default6 as default
};
//# sourceMappingURL=antd_es_locale_pt_PT.js.map
