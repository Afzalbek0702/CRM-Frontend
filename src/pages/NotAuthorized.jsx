import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const NotAuthorized = () => {
    const navigate = useNavigate();
    return (
        <div className='not-authorized'>

            <h1>Ruxsat berilmagan! (Error 403)</h1>

            <Button onClick={() => navigate(-1)} className="btn-default">
                <ArrowLeft className="h-4 w-4" /> Ortga qaytish
            </Button>
        </div>
    )
}

export default NotAuthorized
