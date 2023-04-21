import p5 from "p5";
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
/** @namespace  */
export declare namespace Dw {
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
     *
     * @param {p5.RendererGL} renderer - p5 WEBGL renderer
     * @param {Object}        args     - {distance, center, rotation, viewport}
     *
     */
    class EasyCam {
        INFO: {
            LIBRARY: string;
            VERSION: string;
            AUTHOR: string;
            SOURCE: string;
            toString(): string;
        };
        cam: this;
        LOOK: Vec3;
        UP: Vec3;
        AXIS: {
            YAW: number;
            PITCH: number;
            ALL: any;
            ROLL: number;
        };
        SHIFT_CONSTRAINT: number;
        FIXED_CONSTRAINT: number;
        DRAG_CONSTRAINT: number;
        scale_rotation: number;
        scale_pan: number;
        scale_zoom: number;
        scale_zoomwheel: number;
        distance_min_limit: number;
        distance_min: number;
        distance_max: number;
        state: {
            distance: number;
            center: Vec3;
            rotation: Vec4;
            copy: () => any;
        };
        state_reset: any;
        state_pushed: any;
        viewport: Vec4;
        offset: [number, number];
        mouse: any;
        auto_update: boolean;
        dampedPanX: DampedAction;
        dampedZoom: DampedAction;
        dampedPanY: DampedAction;
        pushed_uMVMatrix: any;
        dampedRotX: DampedAction;
        dampedRotY: DampedAction;
        timedRot: Interpolation;
        timedPan: Interpolation;
        timedzoom: Interpolation;
        renderer: any;
        graphics: {
            _pInst: any;
        } | undefined;
        P5: {
            pixelDensity: () => any;
            mouseX: number;
            mouseY: number;
            registerMethod: (arg0: string, arg1: () => void) => void;
        };
        camEYE: Vec3;
        camLAT: Vec3;
        camRUP: Vec3;
        dampedRotZ: any;
        pushed_uPMatrix: any;
        pushed_rendererState: any;
        /**
         * @constructor
         */
        constructor(renderer: {
            elt: {
                getBoundingClientRect: () => any;
            };
            width: number;
            height: number;
        }, args?: {
            distance: number;
            center: Vec3;
            rotation: Vec4;
            viewport: Vec4;
            offset: [number, number];
        });
        /**
         * sets the WEBGL renderer the camera is working on
         *
         * @param {p5.RendererGL} renderer ... p5 WEBGL renderer
         */
        setCanvas(renderer: p5.RendererGL): void;
        /** @return {p5.RendererGL} the currently used renderer */
        getCanvas(): p5.RendererGL;
        attachListener(el: any, ev: any, fx: {
            el: {
                addEventListener: (arg0: any, arg1: any, arg2: any) => void;
            };
            ev: any;
            op: any;
        }, op: any): void;
        detachListener(fx: {
            el: {
                removeEventListener: (arg0: any, arg1: any, arg2: any) => void;
            } | undefined;
            ev: any;
            op: any;
        }): void;
        /** attaches input-listeners (mouse, touch, key) to the used renderer */
        attachMouseListeners(renderer?: {
            elt: any;
        }): void;
        /** detaches all attached input-listeners */
        removeMouseListeners(): void;
        /** Disposes/releases the camera. */
        dispose(): void;
        /** @return {boolean} the current autoUpdate state */
        getAutoUpdate(): boolean;
        /**
         * If true, the EasyCam will update automatically in a pre-draw step.
         * This updates the camera state and updates the renderers
         * modelview/camera matrix.
         *
         * If false, the update() needs to be called manually. */
        setAutoUpdate(status: boolean): void;
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
        apply(renderer?: {
            _curCamera: {
                camera: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, arg8: any) => void;
            };
            camera: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, arg8: any) => void;
        }): void;
        /** */
        setViewport(viewport: Vec4): void;
        /** @returns {[number, number, number,number]} the current viewport-def, as [x,y,w,h] */
        getViewport(): Vec4;
        /** implemented zoom-cb for mouswheel handler.*/
        mouseWheelZoom(): void;
        /** implemented zoom-cb for mousedrag/touch handler.*/
        mouseDragZoom(): void;
        /** implemented pan-cb for mousedrag/touch handler.*/
        mouseDragPan(): void;
        /** implemented rotate-cb for mousedrag/touch handler.*/
        mouseDragRotate(): void;
        /** (private) returns the used zoom -multiplier for damped actions. */
        getZoomMult(): number;
        /** (private) returns the used pan-multiplier for damped actions. */
        getPanMult(): number;
        /** (private) returns the used rotate-multiplier for damped actions. */
        getRotationMult(): number;
        /** Applies a change to the current zoom.  */
        zoom(dz: number): void;
        /** Applies a change to the current pan-xValue.  */
        panX(dx: number): void;
        /** Applies a change to the current pan-yValue.  */
        panY(dy: number): void;
        /** Applies a change to the current pan-value.  */
        pan(dx: number, dy: number): void;
        /** Applies a change to the current xRotation.  */
        rotateX(rx: number): void;
        /** Applies a change to the current yRotation.  */
        rotateY(ry: number): void;
        /** Applies a change to the current zRotation.  */
        rotateZ(rz: number): void;
        /** Applies a change to the current rotation, using the given axis/angle.  */
        rotate(axis: Vec3, angle?: number): void;
        /** Sets the new camera-distance, interpolated (t) between given A and B. */
        setInterpolatedDistance(valA: number, valB: number, t: number): void;
        /** Sets the new camera-center, interpolated (t) between given A and B. */
        setInterpolatedCenter(valA: Vec3, valB: Vec3, t: number): void;
        /** Sets the new camera-rotation, interpolated (t) between given A and B. */
        setInterpolatedRotation(valA: Vec4, valB: Vec4, t: number): void;
        /** Sets the minimum camera distance. */
        setDistanceMin(distance_min: number): void;
        /** Sets the maximum camera distance. */
        setDistanceMax(distance_max: number): void;
        /**
         * Sets the new camera distance.
         *
         * @param {double} distance new distance.
         * @param {long} duration animation time in millis.
         */
        setDistance(distance: number, duration: number): void;
        /** @returns {double} the current camera distance. */
        getDistance(): number;
        /**
         * Sets the new camera center.
         *
         */
        setCenter(center: Vec3, duration: number): void;
        /** @returns {double[]} the current camera center. */
        getCenter(...args: any[][]): Vec3;
        /**
         * Sets the new camera rotation (quaternion).
         *
         */
        setRotation(rotation: Vec4, duration: number): void;
        /** @returns {double[]} the current camera rotation as quat[q0,q1,q2,q3]. */
        getRotation(): Vec4;
        /** @returns {double[]} the current camera position, aka. the eye position. */
        getPosition(dst: Vec3): Vec3;
        /** @returns {double[]} the current camera up vector. */
        getUpVector(dst: Vec3): Vec3;
        /** @returns {Object} a copy of the camera state {distance,center,rotation} */
        getState(): {
            distance: number;
            center: Vec3;
            rotation: Vec4;
            copy: () => any;
        };
        /**
         * @param {Object} other new camera state {distance,center,rotation}.
         */
        setState(other: {
            distance: number;
            center: Vec3;
            rotation: Vec4;
        }, duration: number): void;
        pushState(): {
            distance: number;
            center: Vec3;
            rotation: Vec4;
            copy: () => any;
        };
        popState(duration: number): void;
        /** sets the current state as reset-state. */
        pushResetState(): {
            distance: number;
            center: Vec3;
            rotation: Vec4;
            copy: () => any;
        };
        /** resets the camera, by applying the reset-state. */
        reset(duration?: number): void;
        /** sets the rotation scale/speed. */
        setRotationScale(scale_rotation: number): void;
        /** sets the pan scale/speed. */
        setPanScale(scale_pan: number): void;
        /** sets the zoom scale/speed. */
        setZoomScale(scale_zoom: number): void;
        /** sets the wheel scale/speed. */
        setWheelScale(wheelScale: number): void;
        /** @returns the rotation scale/speed. */
        getRotationScale(): number;
        /** @returns the pan scale/speed. */
        getPanScale(): number;
        /** @returns the zoom scale/speed. */
        getZoomScale(): number;
        /** @returns the wheel scale/speed. */
        getWheelScale(): number;
        /** sets the default damping scale/speed. */
        setDamping(damping: any): void;
        /** sets the default interpolation time in millis. */
        setDefaultInterpolationTime(duration: number): void;
        /**
         * sets the rotation constraint for each axis separately.
         *
         * @param {boolean} yaw constraint
         * @param {boolean} pitch constraint
         * @param {boolean} roll constraint
         */
        setRotationConstraint(yaw: boolean, pitch: boolean, roll: boolean): void;
        /**
         *
         * begin screen-aligned 2D-drawing.
         *
         * <pre>
         * beginHUD()
         *   disabled depth test
         *   ortho
         *   ... your code is executed here ...
         * endHUD()
         * </pre>
         *
         */
        beginHUD(renderer: {
            push: () => any;
            drawingContext: any;
            width: any;
            height: any;
            uMVMatrix: {
                copy: () => any;
            };
            uPMatrix: {
                copy: () => any;
            };
            resetMatrix: () => void;
            _curCamera: {
                ortho: (arg0: number, arg1: any, arg2: number, arg3: number, arg4: number, arg5: number) => void;
            };
        }, w: undefined, h: number | undefined): void;
        /**
         *
         * end screen-aligned 2D-drawing.
         *
         */
        endHUD(renderer: {
            drawingContext: any;
            uMVMatrix: {
                set: (arg0: any) => void;
            };
            uPMatrix: {
                set: (arg0: any) => void;
            };
            pop: (arg0: any) => void;
        }): void;
    }
    /**
     * Damped callback, that accepts the resulting damped/smooth value.
     *
     * @callback dampedCallback
     * @param {double} value - the damped/smoothed value
     *
     */
    /**
     *
     * DampedAction, for smoothly changing a value to zero.
     *
     * @param {dampedCallback} cb - callback that accepts the damped value as argument.
     */
    class DampedAction {
        value: number;
        damping: number;
        action: (arg0: any) => void;
        /**  @constructor */
        constructor(cb: {
            (d: any): void;
            (d: any): void;
            (d: any): void;
            (d: any): void;
            (d: any): void;
            (d: any): void;
        });
        /** adds a value to the current value beeing damped.
         * @param {double} force - the value beeing added.
         */
        addForce(force: any): void;
        /** updates the damping and calls {@link damped-callback}. */
        update(): boolean;
        /** stops the damping. */
        stop(): void;
    }
    /**
     * Interpolation callback, that implements any form of interpolation between
     * two values A and B and the interpolationparameter t.
     * <pre>
     *   linear: A * (1-t) + B * t
     *   smooth, etc...
     * </pre>
     * @callback interpolationCallback
     * @param {Object} A - First Value
     * @param {Object} B - Second Value
     * @param {double} t - interpolation parameter [0, 1]
     *
     */
    /**
     *
     * Interpolation, for smoothly changing a value by interpolating it over time.
     *
     * @param {interpolationCallback} cb - callback for interpolating between two values.
     */
    class Interpolation {
        default_duration: number;
        action: (arg0: any, arg1: any, arg2: any) => void;
        valA: any;
        valB: any;
        duration: number;
        timer: number;
        active: boolean;
        /**  @constructor */
        constructor(cb: any);
        /** starts the interpolation.
         *  If the given interpolation-duration is 0, then
         * {@link interpolation-callback} is called immediately.
         */
        start(valA: any, valB: any, duration?: number, actions?: DampedAction[]): void;
        /** updates the interpolation and calls {@link interpolation-callback}.*/
        update(): void;
        interpolate(t: number): void;
        /** stops the interpolation. */
        stop(): void;
    }
    /**
     * Rotation as Quaternion [q0, q1, q2, q3]
     *
     * Note: Only functions that were required for the EasyCam to work are implemented.
     *
     * @namespace
     */
    namespace Rotation {
        function assert(dst?: Vec4): Vec4;
        /** returns an identity rotation [1,0,0,0] */
        function identity(): Vec4;
        /**
         * Applies the rotation to a vector and returns dst or a new vector.
         *
         * @param rot - Rotation (Quaternion)
         * @param vec - vector to be rotated by rot
         * @param dst - resulting vector
         * @returns dst- resulting vector
         */
        function applyToVec3(rot: Vec4, vec: Vec3, dst?: Vec3): Vec3;
        /**
         * Applies the rotation to another rotation and returns dst or a new rotation.
         *
         * @param  rotA - RotationA (Quaternion)
         * @param  rotB - RotationB (Quaternion)
         * @param  dst - resulting rotation
         * @returns  dst - resulting rotation
         */
        function applyToRotation(rotA: Vec4, rotB: Vec4, dst: Vec4): Vec4;
        /**
         * Interpolates a rotation.
         *
         * @param  rotA - RotationA (Quaternion)
         * @param  rotB - RotationB (Quaternion)
         * @param  t - interpolation parameter
         * @param  dst - resulting rotation
         * @returns  dst - resulting rotation
         */
        function slerp(rotA: Vec4, rotB: Vec4, t: number, dst: Vec4): Vec4;
        /**
         * Creates/Initiates a new Rotation
         *
         * <pre>
         *
         *    1) Axis,Angle:
         *       {
         *         axis : [x, y, z],
         *         angle: double
         *       }
         *
         *    2) Another Rotation:
         *       {
         *         rotation : [q0, q1, q2, q3],
         *         normalize: boolean
         *       }
         *
         *    3) 3 euler angles, XYZ-order:
         *       {
         *         angles_xyz : [rX, rY, rZ]
         *       }
         *
         * </pre>
         *
         *
         * @param {Object} def - Definition, for creating the new Rotation
         * @param dst - resulting rotation
         * @returns dst - resulting rotation
         */
        function create(def: {
            axis?: Vec3;
            angle?: number;
            rotation?: Vec4;
            normalize?: boolean;
            angles_xyz?: Vec3;
        }, dst?: Vec4): Vec4;
    }
    /**
     * Scalar as a simple number.
     *
     * Note: Only functions that were required for the EasyCam to work are implemented.
     *
     * @namespace
     */
    namespace Scalar {
        /**
         * Linear interpolation between A and B using t[0,1]
         */
        function mix(a: number, b: number, t: number): number;
        /**
         * modifying t as a function of smoothstep(0,1,t);
         */
        function smoothstep(x: number): number;
        /**
         * modifying t as a function of smootherstep(0,1,t);
         */
        function smootherstep(x: number): number;
    }
    /**
     * Vec3 as a 3D vector (Array)
     *
     * @namespace
     */
    namespace Vec3 {
        function assert(dst?: Vec3): Vec3;
        function isScalar(arg: any): boolean;
        /** addition: <pre> dst = a + b </pre>  */
        function add(a: Vec3, b: Vec3 | number, dst: Vec3): Vec3;
        /** componentwise multiplication: <pre> dst = a * b </pre>  */
        function mult(a: Vec3, b: Vec3 | number, dst: Vec3): Vec3;
        /** squared length  */
        function magSq(a: Vec3): number;
        /** length  */
        function mag(a: Vec3): number;
        /** dot-product  */
        function dot(a: Vec3, b: Vec3): number;
        /** cross-product  */
        function cross(a: Vec3, b: Vec3, dst?: Vec3): Vec3;
        /** angle  */
        function angle(v1: Vec3, v2: Vec3): number;
        /** linear interpolation: <pre> dst = a * (1 - t) + b * t </pre> */
        function mix(a: Vec3, b: Vec3, t: number, dst?: Vec3): Vec3;
    }
}
export declare function createEasyCam(): Dw.EasyCam;
export declare function setContext(context: p5): void;
export {};
