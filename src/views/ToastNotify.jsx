import 'animate.css';
import { IoIosWarning } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { MdDangerous } from "react-icons/md";
function ToastNotify({type,message}){
    const styles = {
        "success":{
            backgroundColor:"bg-green-50",
            borderColor:"border-green-300",
            textColor:"text-green-700",
            icon:<FaCheckCircle size={'1.3rem'} color="green" />
        },
        "warning":{
            backgroundColor:"bg-yellow-50",
            borderColor:"border-yellow-300",
            textColor:"text-yellow-700",
            icon:<IoIosWarning size={'1.3rem'} color="brown"/>
        },
        "error":{
            backgroundColor:"bg-red-50",
            borderColor:"border-red-300",
            textColor:"text-red-700",
            icon:<MdDangerous size={'1.3rem'} color="brown" />
        }
    }

    return (
        <div className={`p-2 px-3 ${styles[type].backgroundColor} border-1 ${styles[type].borderColor} flex items-center gap-2 absolute top-4 left-[50%] -translate-x-[50%] rounded-lg animate__animated animate__fadeInLeft animate-duration__.5s`}>
            {styles[type].icon}
            <p className={`text-md ${styles[type].textColor} font-medium`}>{message}</p>
        </div>
    )
}

export default ToastNotify;