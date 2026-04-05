import { useState, useEffect, useRef } from "react";

export function useCountUp(end, duration = 800, start = 0) {
	const [count, setCount] = useState(start);
	const countRef = useRef(start);
	const startTimeRef = useRef(null);
	const animationRef = useRef(null);

	useEffect(() => {
		const actualDuration = Math.min(duration, Math.max(300, end * 50));

		const animate = (timestamp) => {
			if (!startTimeRef.current) startTimeRef.current = timestamp;

			const progress = timestamp - startTimeRef.current;
			const progressPercentage = Math.min(progress / actualDuration, 1);
			const easeOutQuart = 1 - Math.pow(1 - progressPercentage, 4);
			const currentCount = Math.floor(start + (end - start) * easeOutQuart);

			if (currentCount !== countRef.current) {
				countRef.current = currentCount;
				setCount(currentCount);
			}

			if (progressPercentage < 1) {
				animationRef.current = requestAnimationFrame(animate);
			} else {
				setCount(end);
			}
		};

		startTimeRef.current = null;
		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [end, duration, start]);

	return count;
}