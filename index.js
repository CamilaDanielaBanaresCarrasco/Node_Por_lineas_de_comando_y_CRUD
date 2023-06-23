// Importar las dependencias necesarias
const yargs = require('yargs');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//----------------------------------------------------------------------------------------------------------
// Función para crear una nueva tarea
const funcionCreate = async (argv) => {
    const { titulo, contenido } = argv;
    const id = uuidv4().slice(0, 8);
    const nuevaTarea = { id: id, titulo: titulo, contenido: contenido };
    try {
        // Leer el archivo tareas.txt
        const tarea = await fs.promises.readFile('tareas.txt', 'utf8');
        const arrayTareas = JSON.parse(tarea);
        // Agregar la nueva tarea al array de tareas
        arrayTareas.push(nuevaTarea);
        // Guardar el array de tareas actualizado en el archivo
        await fs.promises.writeFile('tareas.txt', JSON.stringify(arrayTareas, null, 2));
        console.log("Nueva Tarea Agregada");
    } catch (error) {
        console.error("Error al crear la tarea:", error);
    }
};
//----------------------------------------------------------------------------------------------------------

// Función para mostrar todas las tareas existentes
const funcionRead = async () => {
    try {
        // Leer el archivo tareas.txt
        const tareasArchivo = await fs.promises.readFile('tareas.txt', 'utf8');
        const arrayTareas = JSON.parse(tareasArchivo);
        
        let contador = 0;
        
        for (const tarea of arrayTareas) {
            const { titulo, contenido, id } = tarea;
            contador++;
            console.log(`Tarea número ${contador}`);
            console.log(`ID: ${id}`);
            console.log(`Título: ${titulo}`);
            console.log(`Contenido: ${contenido}`);
            console.log("");
        }
    } catch (error) {
        console.error("Error al leer las tareas:", error);
    }
};
//----------------------------------------------------------------------------------------------------------

// Función para actualizar una tarea existente
const funcionUpdate = async (argv) => {
    const { id, titulo, contenido } = argv;
    try {
        // Leer el archivo tareas.txt
        const tareasArchivo = await fs.promises.readFile('tareas.txt', 'utf8');
        const arrayTareas = JSON.parse(tareasArchivo);
        // Buscar la tarea con el ID especificado
        const tareaActual = arrayTareas.findIndex(tarea => tarea.id === id);
        if (tareaActual !== -1) {
            // Actualizar el título y/o contenido de la tarea si se proporcionaron nuevos valores
            arrayTareas[tareaActual].titulo = titulo || arrayTareas[tareaActual].titulo;
            arrayTareas[tareaActual].contenido = contenido || arrayTareas[tareaActual].contenido;
            // Guardar el array de tareas actualizado en el archivo
            await fs.promises.writeFile('tareas.txt', JSON.stringify(arrayTareas, null, 2));
            console.log("La tarea ha sido actualizada");
        } else {
            console.log("No se encontró la tarea con el ID especificado");
        }
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
    }
};
//----------------------------------------------------------------------------------------------------------

// Función para eliminar una tarea
const funcionDelete = async ({ id }) => {
    try {
        // Leer el archivo tareas.txt
        const tareasArchivo = await fs.promises.readFile('tareas.txt', 'utf8');
        const arrayTareas = JSON.parse(tareasArchivo);
        // Filtrar el array de tareas para excluir la tarea con el ID especificado
        const nuevaTarea = arrayTareas.filter(tarea => tarea.id !== id);
        // Guardar el nuevo array de tareas en el archivo
        await fs.promises.writeFile('tareas.txt', JSON.stringify(nuevaTarea, null, 2));
        console.log("La tarea ha sido eliminada exitosamente");
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
    }
};
//----------------------------------------------------------------------------------------------------------

// Configuración del comando 'create'
const createConfig = {
    titulo: {
        describe: "El nombre de la tarea a realizar",
        alias: "t",
        demandOption: true // Tarea obligatoria
    },
    contenido: {
        describe: "El contenido de la tarea a realizar",
        alias: "c",
        demandOption: true // Tarea obligatoria
    }
};
//----------------------------------------------------------------------------------------------------------

// Configuración del comando 'update'
const updateConfig = {
    id: {
        describe: "El ID de la tarea a actualizar",
        alias: "i",
        demandOption: true // Tarea obligatoria
    },
    titulo: {
        describe: "El nuevo nombre de la tarea a realizar",
        alias: "t",
        demandOption: false // Tarea opcional
    },
    contenido: {
        describe: "El nuevo contenido de la tarea a realizar",
        alias: "c",
        demandOption: false // Tarea opcional
    }
};

// Configuración del comando 'delete'
const deleteConfig = {
    id: {
        describe: "El identificador de la tarea a eliminar",
        alias: "i",
        demandOption: true // Tarea obligatoria
    }
};

// Procesar los comandos con yargs
const args = yargs
    .command('create', 'Crear una nueva tarea', createConfig, (argv) => funcionCreate(argv))
    //como llamar al metodo en consola? 
    //node index.js create --titulo="nueva tarea" --contenido="Esta es una tarea"
        //----------------------------------------------------------------------------------------------------------

    .command('read', 'Mostrar todas las tareas', {}, () => funcionRead())
    //Como llamar al metodo en consola?
    //node index.js read
        //----------------------------------------------------------------------------------------------------------
    .command('update', 'Actualizar una tarea existente', updateConfig, (argv) => funcionUpdate(argv))
    // como llamar al metodo en consola? 
    //node index.js update --id=6cf21f922 --titulo="Nuevo título" --contenido="Nuevo contenido"
        //----------------------------------------------------------------------------------------------------------
    .command('delete', 'Eliminar una tarea', deleteConfig , (argv) => funcionDelete(argv))
    //Como llamar al metodo en consola? 
    //node index.js delete --id=6cf21f922
    .help()
    .argv;

console.log(args);