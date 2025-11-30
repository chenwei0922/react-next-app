export interface HandState {
  x: number
  y: number
  detected: boolean
  isPinching: boolean
  pinchDistance: number
}
export interface InteractionStateType {
  leftHand: HandState
  rightHand: Omit<HandState, 'pinchDistance'>
}

export type HandLandmarkerResult = {
  landmarks: Array<Array<{ x: number; y: number; z: number }>>;
  handedness: Array<{ categoryName: string }>;
};