declare namespace Dw {
    var ext.EasyCam: EasyCam;
    var ext.DampedAction: DampedAction;
    var ext.Interpolation: Interpolation;
    var ext.Rotation: any;
    var ext.Vec3: any;
    var ext.Scalar: any;
}

/**
 * EasyCam
 *
 * <pre>
 *
 *   new Dw.EasyCam(p5.RendererGL, {
 *     distance : z,                 // scalar
 *     center   : [x, y, z],         // vector
 *     rotation : [q0, q1, q2, q3],  // quaternion
 *     viewport : [x, y, w, h],      // array
 *   }
 *
 * </pre>
 * @param renderer - p5 WEBGL renderer
 * @param args - {distance, center, rotation, viewport}
 */
declare class EasyCam {
    constructor(renderer: p5.RendererGL, args: any);
    /**
     * sets the WEBGL renderer the camera is working on
     * @param renderer - ... p5 WEBGL renderer
     */
    setCanvas(renderer: p5.RendererGL): void;
    /**
     * @returns the currently used renderer
     */
    getCanvas(): p5.RendererGL;
    /**
     * attaches input-listeners (mouse, touch, key) to the used renderer
     */
    attachMouseListeners(): void;
    /**
     * detaches all attached input-listeners
     */
    removeMouseListeners(): void;
    /**
     * Disposes/releases the camera.
     */
    dispose(): void;
    /**
     * @returns the current autoUpdate state
     */
    getAutoUpdate(): boolean;
    /**
     * If true, the EasyCam will update automatically in a pre-draw step.
     * This updates the camera state and updates the renderers
     * modelview/camera matrix.
     *
     * If false, the update() needs to be called manually.
     * @param the - new autoUpdate state
     */
    setAutoUpdate(the: boolean): void;
    /**
     * Updates the camera state (interpolated / damped animations) and updates
     * the renderers' modelview/camera matrix.
     *
     * if "auto_update" is true, this is called automatically in a pre-draw call.
     */
    update(): void;
    /**
     * Applies the current camera state to the renderers' modelview/camera matrix.
     * If no argument is given, then the cameras currently set renderer is used.
     */
    apply(): void;
    /**
     * @param the - new viewport-def, as [x,y,w,h]
     */
    setViewport(the: int[]): void;
    /**
     * @returns the current viewport-def, as [x,y,w,h]
     */
    getViewport(): int[];
    /**
     * implemented zoom-cb for mouswheel handler.
     */
    mouseWheelZoom(): void;
    /**
     * implemented zoom-cb for mousedrag/touch handler.
     */
    mouseDragZoom(): void;
    /**
     * implemented pan-cb for mousedrag/touch handler.
     */
    mouseDragPan(): void;
    /**
     * implemented rotate-cb for mousedrag/touch handler.
     */
    mouseDragRotate(): void;
    /**
     * (private) returns the used zoom -multiplier for damped actions.
     */
    getZoomMult(): void;
    /**
     * (private) returns the used pan-multiplier for damped actions.
     */
    getPanMult(): void;
    /**
     * (private) returns the used rotate-multiplier for damped actions.
     */
    getRotationMult(): void;
    /**
     * Applies a change to the current zoom.
     */
    zoom(): void;
    /**
     * Applies a change to the current pan-xValue.
     */
    panX(): void;
    /**
     * Applies a change to the current pan-yValue.
     */
    panY(): void;
    /**
     * Applies a change to the current pan-value.
     */
    pan(): void;
    /**
     * Applies a change to the current xRotation.
     */
    rotateX(): void;
    /**
     * Applies a change to the current yRotation.
     */
    rotateY(): void;
    /**
     * Applies a change to the current zRotation.
     */
    rotateZ(): void;
    /**
     * Applies a change to the current rotation, using the given axis/angle.
     */
    rotate(): void;
    /**
     * Sets the new camera-distance, interpolated (t) between given A and B.
     */
    setInterpolatedDistance(): void;
    /**
     * Sets the new camera-center, interpolated (t) between given A and B.
     */
    setInterpolatedCenter(): void;
    /**
     * Sets the new camera-rotation, interpolated (t) between given A and B.
     */
    setInterpolatedRotation(): void;
    /**
     * Sets the minimum camera distance.
     */
    setDistanceMin(): void;
    /**
     * Sets the maximum camera distance.
     */
    setDistanceMax(): void;
    /**
     * Sets the new camera distance.
     * @param distance - new distance.
     * @param duration - animation time in millis.
     */
    setDistance(distance: double, duration: long): void;
    /**
     * @returns the current camera distance.
     */
    getDistance(): double;
    /**
     * Sets the new camera center.
     * @param center - new center.
     * @param duration - animation time in millis.
     */
    setCenter(center: double[], duration: long): void;
    /**
     * @returns the current camera center.
     */
    getCenter(): double[];
    /**
     * Sets the new camera rotation (quaternion).
     * @param rotation - new rotation as quat[q0,q1,q2,q3].
     * @param duration - animation time in millis.
     */
    setRotation(rotation: double[], duration: long): void;
    /**
     * @returns the current camera rotation as quat[q0,q1,q2,q3].
     */
    getRotation(): double[];
    /**
     * @returns the current camera position, aka. the eye position.
     */
    getPosition(): double[];
    /**
     * @returns the current camera up vector.
     */
    getUpVector(): double[];
    /**
     * @returns a copy of the camera state {distance,center,rotation}
     */
    getState(): any;
    /**
     * @param a - new camera state {distance,center,rotation}.
     * @param animation - time in millis.
     */
    setState(a: any, animation: long): void;
    /**
     * sets the current state as reset-state.
     */
    pushResetState(): void;
    /**
     * resets the camera, by applying the reset-state.
     */
    reset(): void;
    /**
     * sets the rotation scale/speed.
     */
    setRotationScale(): void;
    /**
     * sets the pan scale/speed.
     */
    setPanScale(): void;
    /**
     * sets the zoom scale/speed.
     */
    setZoomScale(): void;
    /**
     * sets the wheel scale/speed.
     */
    setWheelScale(): void;
    /**
     * @returns the rotation scale/speed.
     */
    getRotationScale(): any;
    /**
     * @returns the pan scale/speed.
     */
    getPanScale(): any;
    /**
     * @returns the zoom scale/speed.
     */
    getZoomScale(): any;
    /**
     * @returns the wheel scale/speed.
     */
    getWheelScale(): any;
    /**
     * sets the default damping scale/speed.
     */
    setDamping(): void;
    /**
     * sets the default interpolation time in millis.
     */
    setDefaultInterpolationTime(): void;
    /**
     * sets the rotation constraint for each axis separately.
     * @param yaw - constraint
     * @param pitch - constraint
     * @param roll - constraint
     */
    setRotationConstraint(yaw: boolean, pitch: boolean, roll: boolean): void;
    /**
     * begin screen-aligned 2D-drawing.
     *
     * <pre>
     * beginHUD()
     *   disabled depth test
     *   ortho
     *   ... your code is executed here ...
     * endHUD()
     * </pre>
     */
    beginHUD(): void;
    /**
     * end screen-aligned 2D-drawing.
     */
    endHUD(): void;
}

/**
 * Damped callback, that accepts the resulting damped/smooth value.
 * @param value - the damped/smoothed value
 */
declare type dampedCallback = (value: double) => void;

/**
 * DampedAction, for smoothly changing a value to zero.
 * @param cb - callback that accepts the damped value as argument.
 */
declare class DampedAction {
    constructor(cb: dampedCallback);
    /**
     * adds a value to the current value beeing damped.
     * @param force - the value beeing added.
     */
    addForce(force: double): void;
    /**
     * updates the damping and calls {@link damped-callback}.
     */
    update(): void;
    /**
     * stops the damping.
     */
    stop(): void;
}

/**
 * Interpolation callback, that implements any form of interpolation between
 * two values A and B and the interpolationparameter t.
 * <pre>
 *   linear: A * (1-t) + B * t
 *   smooth, etc...
 * </pre>
 * @param A - First Value
 * @param B - Second Value
 * @param t - interpolation parameter [0, 1]
 */
declare type interpolationCallback = (A: any, B: any, t: double) => void;

/**
 * Interpolation, for smoothly changing a value by interpolating it over time.
 * @param cb - callback for interpolating between two values.
 */
declare class Interpolation {
    constructor(cb: interpolationCallback);
    /**
     * starts the interpolation.
     *  If the given interpolation-duration is 0, then
     * {@link interpolation-callback} is called immediately.
     */
    start(): void;
    /**
     * updates the interpolation and calls {@link interpolation-callback}.
     */
    update(): void;
    /**
     * stops the interpolation.
     */
    stop(): void;
}

