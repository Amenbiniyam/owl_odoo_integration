/** @odoo-module **/

import {registry} from '@web/core/registry';

const {Component, useState, onWillStart, useRef} = owl;
// this service used to perform some CRUD Operation
import {useService} from "@web/core/utils/hooks";

export class OwlTodoList extends Component {

    setup(){
        this.state = useState({
            // Initial state
            task:{name:"", color:"#FF0000", completed:false},
            taskList:[],
            isEdit: false,
            activeId: false,
        })
        this.orm = useService("orm")
        this.model = "owl.todo.list"
        this.searchInput = useRef("search-input")
        // before the component render it will get the data
        onWillStart(async ()=>{
            await this.getAllTasks()
        })
    }

    async getAllTasks() {
        // searchRead method accept model name, domain , and the fields we want
        this.state.taskList = await this.orm.searchRead(this.model, [], ["name", "color", "completed"])
    }

     addTask(){
        this.resetForm()
        this.state.activeId = false
        this.state.isEdit = false
    }

    editTask(task){
        this.state.activeId = task.id
        this.state.isEdit = true
        this.state.task = {...task}
    }

    async saveTask(){

        if (!this.state.isEdit){
            // creating task
            await this.orm.create(this.model, [this.state.task])
            this.resetForm()
        } else {
            // editing task
            await this.orm.write(this.model, [this.state.activeId], this.state.task)
        }

        // when everytime the save task the page to refresh
        await this.getAllTasks()
    }

    resetForm(){
        this.state.task = {name:"", color:"#FF0000", completed:false}
    }

    async deleteTask(task){
        await this.orm.unlink(this.model, [task.id])
        await this.getAllTasks()
    }

    async searchTasks(){
        const text = this.searchInput.el.value
        this.state.taskList = await this.orm.searchRead(this.model, [['name','ilike',text]], ["name", "color", "completed"])
    }

    // used to check the task completed
    async toggleTask(e, task){
        await this.orm.write(this.model, [task.id], {completed: e.target.checked})
        await this.getAllTasks()
    }

    async updateColor(e, task){
        await this.orm.write(this.model, [task.id], {color: e.target.value})
        await this.getAllTasks()
    }


}

// owl.TodoList is template name in xml file in static/src folder
// we will use action_todo_list_js for action id in views and
// owl.action_todo_list_js as a tag in action section in views
OwlTodoList.template = 'owl.TodoList'
registry.category('actions').add('owl.action_todo_list_js', OwlTodoList);