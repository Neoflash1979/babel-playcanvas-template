/**
 * Class decorator allowing the use of ES6 classes  
 * to define and create PlayCanvas script types. 
 * @param {pc.Application} [app]
 */
export const createScript = function(app?: pc.Application) {
    return function (obj: any) {
        const instance = new obj();
        const script = pc.createScript(instance.name, app);
        const attributes = [];
    
        // Add public attributes accessible in the editor
        if (instance.attributes) {
            for (let attr in instance.attributes) {
                attributes.push(attr)
                script.attributes.add(attr, instance.attributes[attr])
            }
        }
        // Add intance properties and methods to prototype
        for (let prop in instance) {
            if (prop === 'attributes' || prop === 'name' || attributes.includes(prop)) {
                // do nothing
            } else {
                script.prototype[prop] = instance[prop];
            }
        }
        
        // Add getters and setters to prototype
        const prototypePropertyDescriptors = Object.getOwnPropertyDescriptors(
            obj.prototype
        );
        for (const prop in prototypePropertyDescriptors) {
            if (prop !== "constructor") {
                const descriptors = prototypePropertyDescriptors[prop];
                const { get, set } = descriptors;
                
                if (get || set) {
                    const scriptDescriptor = {
                        get,
                        set,
                        enumerable: false,
                        configurable: true,
                    };
                    
                    Object.defineProperty(script.prototype, prop, scriptDescriptor);
                }
            }
        }
    
        // Add static properties
        for (let prop in obj) {
            script[prop] = obj[prop];
        }
    }
}


/**
 * Base class to be extended when defining  
 * ScriptType classes
 * @export
 * @class ScriptTypeBase
 */
export class ScriptTypeBase {
    /**
     * The pc.Application that the instance of this type belongs to.
     * @type {pc.Application}
     * @memberof ScriptType
     */
    app: pc.Application;

    /**
     * 	The pc.Entity that the instance of this type belongs to.
     * @type {pc.Entity}
     * @memberof ScriptType
     */
    entity: pc.Entity;

    /**
     * True if the instance of this type is in running state.
     * @type {boolean}
     * @memberof ScriptType
     */
    enabled: boolean;    
}
