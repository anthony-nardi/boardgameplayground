import React, { useState, useEffect } from 'react';
import { Loader } from "@mantine/core";

export default function useLoadingSpinner() {
    const [isLoading, setIsLoading] = useState(false)

    return {
        setIsLoading,
        isLoading
    }
}   