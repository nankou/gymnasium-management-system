import Vue from "vue";

/**
 * @description 按需引入Element-UI组件
 * */
import {
  Loading, Button, Container, Header, Tooltip, Dropdown, Avatar, DropdownMenu, DropdownItem,
  Main, Form, FormItem, Input, Breadcrumb, BreadcrumbItem, Menu, MenuItem, Pagination, Table,
  TableColumn, Tag, Scrollbar, Submenu, Dialog, Col, Row, Upload, Popover, Option, Select,
  InputNumber, PageHeader, Image, Cascader, TabPane, Tabs, Radio, Switch, Drawer, Footer,
  RadioGroup, RadioButton, MenuItemGroup, Checkbox, Tree, Progress, Backtop, Icon, DatePicker,
  Autocomplete
} from "element-ui";

Vue.component("ElButton", Button);
Vue.component("ElContainer", Container);
Vue.component("ElHeader", Header);
Vue.component("ElTooltip", Tooltip);
Vue.component("ElDropdown", Dropdown);
Vue.component("ElDropdownMenu", DropdownMenu);
Vue.component("ElDropdownItem", DropdownItem);
Vue.component("ElAvatar", Avatar);
Vue.component("ElMain", Main);
Vue.component("ElForm", Form);
Vue.component("ElFormItem", FormItem);
Vue.component("ElInput", Input);
Vue.component("ElBreadcrumb", Breadcrumb);
Vue.component("ElBreadcrumbItem", BreadcrumbItem);
Vue.component("ElMenu", Menu);
Vue.component("ElMenuItem", MenuItem);
Vue.component("ElPagination", Pagination);
Vue.component("ElTable", Table);
Vue.component("ElTableColumn", TableColumn);
Vue.component("ElTag", Tag);
Vue.component("ElScrollbar", Scrollbar);
Vue.component("ElSubmenu", Submenu);
Vue.component("ElDialog", Dialog);
Vue.component("ElCol", Col);
Vue.component("ElRow", Row);
Vue.component("ElUpload", Upload);
Vue.component("ElPopover", Popover);
Vue.component("ElOption", Option);
Vue.component("ElSelect", Select);
Vue.component("ElInputNumber", InputNumber);
Vue.component("ElPageHeader", PageHeader);
Vue.component("ElImage", Image);
Vue.component("ElCascader", Cascader);
Vue.component("ElTabPane", TabPane);
Vue.component("ElTabs", Tabs);
Vue.component("ElRadio", Radio);
Vue.component("ElSwitch", Switch);
Vue.component("ElDrawer", Drawer);
Vue.component("ElFooter", Footer);
Vue.component("ElRadioGroup", RadioGroup);
Vue.component("ElRadioButton", RadioButton);
Vue.component("ElMenuItemGroup", MenuItemGroup);
Vue.component("ElCheckbox", Checkbox);
Vue.component("ElTree", Tree);
Vue.component("ElProgress", Progress);
Vue.component("ElBacktop", Backtop);
Vue.component("ElIcon", Icon);
Vue.component("ElDatePicker", DatePicker);
Vue.component("ElAutocomplete", Autocomplete);
Vue.use(Loading.directive);
