export const Variants = {
	open: (WindowsWidth: number) => ({
		width: `${WindowsWidth - Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
		marginLeft: `${Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
	}),
	closed: {
		width: "100vw",
		marginLeft: "0",
		transition: {
			delay: .6
		}
	}
}
export const LeftFadeIn = {
	open: (direction: number) => ({
		x: 0,
		opacity: 1,
		transition: {
			x: { stiffness: 1000, velocity: -100 * direction }
		}
	}),
	closed: (direction: number) => ({
		x: 50 * direction,
		opacity: 0,
		transition: {
			x: { stiffness: 1000 }
		}
	})
}
export const InputVariants = {
	open: (WindowsWidth: number) => ({
		margin: 0,
		width: `${WindowsWidth - Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
	}),
	closed: {
		width: "100vw",
		transition: {
			delay: .6
		}
	}
}
export const fillLine = {
	open: {
		pathLength: 1,
		transition: {
			type: "spring",
			stiffness: 20,
			restDelta: 2
		}
	},
	closed: {
		pathLength: 0,
		transition: {
			delay: 0.5,
			type: "spring",
			stiffness: 400,
			damping: 40
		}
	}
}
export const sidebar = {
	open: (height = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
		transition: {
			type: "spring",
			stiffness: 20,
			restDelta: 2
		}
	}),
	closed: {
		clipPath: "circle(30px at 40px 40px)",
		transition: {
			delay: 0.5,
			type: "spring",
			stiffness: 400,
			damping: 40
		}
	}
};
export const FadeIn = {
	open: {
		y: 0,
		opacity: 1,
		transition: {
			y: { stiffness: 1000, velocity: -100 }
		}
	},
	closed: {
		y: 50,
		opacity: 0,
		transition: {
			y: { stiffness: 1000 }
		}
	}
}
