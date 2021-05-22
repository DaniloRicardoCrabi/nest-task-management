import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get_tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){

  }


  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
    return await this.taskRepository.getTasks(filterDto, user);
  }


  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    
    if(!found){
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found; 
  }

  async getTasksByUserAndId(id: number, user: User): Promise<Task> {
    const  tasks = await this.taskRepository.findOne({id,userId: user.id});
    
    if(!tasks){
      throw new NotFoundException(`Not found tasks for User "${user.username}" `);
    }
    return tasks; 
  }



  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    
    return await this.taskRepository.createTask(createTaskDto, user);
  }


  async deleteTask(id: number, user: User): Promise<void> {
   
     const result = await this.taskRepository.delete({id, userId: user.id});
   
     if(result.affected === 0){
      throw new NotFoundException(`Task with ID "${id}" not found`);
     }
  }

  async updateTaskStatus(id: number, user: User, status: TaskStatus): Promise<Task> {
    const task = await this.getTasksByUserAndId(id,user);
    task.status=status;
    await task.save();
    return task;
  }
  
}
