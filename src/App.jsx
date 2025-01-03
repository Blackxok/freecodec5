import React, { useEffect, useRef, useState } from 'react'
import './App.css'

const App = () => {
	const [breakLength, setBreakLength] = useState(5)
	const [sessionLength, setSessionLength] = useState(25)
	const [timeLeft, setTimeLeft] = useState(1500) // 25 * 60
	const [isRunning, setIsRunning] = useState(false)
	const [isSession, setIsSession] = useState(true)
	const timerRef = useRef(null)

	const formatTime = time => {
		const minutes = Math.floor(time / 60)
		const seconds = time % 60
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const handleStartStop = () => {
		if (isRunning) {
			clearInterval(timerRef.current)
			setIsRunning(false)
		} else {
			setIsRunning(true)
			timerRef.current = setInterval(() => {
				setTimeLeft(prev => {
					if (prev === 0) {
						setIsSession(!isSession)
						return isSession ? breakLength * 60 : sessionLength * 60
					}
					return prev - 1
				})
			}, 1000)
		}
	}

	const handleReset = () => {
		clearInterval(timerRef.current)
		setIsRunning(false)
		setBreakLength(5)
		setSessionLength(25)
		setTimeLeft(1500)
		setIsSession(true)
		const beep = document.getElementById('beep')
		beep.pause()
		beep.currentTime = 0
	}

	const handleIncrement = type => {
		if (type === 'break' && breakLength < 60) {
			setBreakLength(breakLength + 1)
		} else if (type === 'session' && sessionLength < 60) {
			setSessionLength(sessionLength + 1)
			if (!isRunning) setTimeLeft((sessionLength + 1) * 60)
		}
	}

	const handleDecrement = type => {
		if (type === 'break' && breakLength > 1) {
			setBreakLength(breakLength - 1)
		} else if (type === 'session' && sessionLength > 1) {
			setSessionLength(sessionLength - 1)
			if (!isRunning) setTimeLeft((sessionLength - 1) * 60)
		}
	}

	useEffect(() => {
		if (timeLeft === 0) {
			const beep = document.getElementById('beep')
			beep.play()
		}
	}, [timeLeft])

	return (
		<div className='app'>
			<h1>25 + 5 Pomodoro!!</h1>
			<div className='length-control'>
				<div id='break-label'>Break Length</div>
				<button id='break-decrement' onClick={() => handleDecrement('break')}>
					-
				</button>
				<div id='break-length'>{breakLength}</div>
				<button id='break-increment' onClick={() => handleIncrement('break')}>
					+
				</button>
			</div>

			<div className='length-control'>
				<div id='session-label'>Session Length</div>
				<button id='session-decrement' onClick={() => handleDecrement('session')}>
					-
				</button>
				<div id='session-length'>{sessionLength}</div>
				<button id='session-increment' onClick={() => handleIncrement('session')}>
					+
				</button>
			</div>

			<div className='timer'>
				<div id='timer-label'>{isSession ? 'Session' : 'Break'}</div>
				<div id='time-left'>{formatTime(timeLeft)}</div>
			</div>

			<div className='controls'>
				<button id='start_stop' onClick={handleStartStop}>
					{isRunning ? 'Pause' : 'Start'}
				</button>
				<button id='reset' onClick={handleReset}>
					Reset
				</button>
			</div>

			<audio id='beep' src='https://www.soundjay.com/button/beep-07.wav'></audio>
		</div>
	)
}

export default App
