import axiosInstance from "../axios";

export default async function httpRequest(type: string, url: string, data: any =null){
    let config = {}

    if(localStorage.getItem('access_token')){
        config = {
            'headers': {
                'Authorization': 'JWT ' + localStorage.getItem('access_token')
            }
        }
    }

    if(type === 'GET'){
        return axiosInstance.get(url, config)
    }else if(type === 'POST'){
        return axiosInstance.post(url, data, config)
    }else if(type === 'PATCH'){
        return axiosInstance.patch(url, data, config)
    }else if(type === 'DEL'){
        return axiosInstance.delete(url, config)
    }

    return Promise.reject(`Rest API of type ${type} is invalid`);
}