/** @odoo-module **/

import { registry } from '@web/core/registry';
const { Component,useState } = owl;
//import { useService } from "@web/core/utils/hooks";

export class OwlTodoList extends Component {
    setup(){
      this.state = useState({value:1})
    }


}
// owl.TodoList is template name in xml file in static/src folder
// we will use action_todo_list_js for action id in views and
// owl.action_todo_list_js as a tag in action section in views
OwlTodoList.template = 'owl.TodoList'
registry.category('actions').add('owl.action_todo_list_js', OwlTodoList);