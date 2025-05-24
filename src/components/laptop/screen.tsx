const ScreenContent = (size: number[]) => {
    return(
        <div  className="bg-slate-900 inline-block min-h-full min-w-full overflow-hidden" 
            style={{
                overscrollBehaviorY:"none",
                opacity:1, 
                overflowY:"auto", 
                width: `${size[0]}px`, 
                height: `${size[1]}px` 
            }} 
        >

        <h1>Loading</h1>
        </div>
    );
}

export default ScreenContent;
