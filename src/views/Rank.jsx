
function Rank({rank,name}){
    return (
        <div className={`p-2 px-4 rounded-lg bg-blue-50 border-1 border-blue-300 h-12 w-[70%] mx-auto flex justify-start`}>
            <div className={`text-xl font-bold font-poppins`}>{rank}</div>
            <div className={`w-full`}>
                <div className={`text-center whitespace-nowrap text-lg font-semibold font-work mx-auto`}>{name}</div>
            </div>

        </div>
    )
}

export default Rank;