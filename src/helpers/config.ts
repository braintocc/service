import { env } from 'bun';

let config: any; 

export const initializeConfiguration = async () => {
    config = env
    
}

export const getConfiguration =  () => {
    return config;
}