<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork,
        },
      }"
      :toolbar="[['bold', 'italic', 'strike', 'underline'], ['save']]"
    />
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" />

      <q-time v-model="time" />
      <p>fecha:{{date}}, hora:{{time}}</p>
    </div>
    <q-card
      class="row"
      flat
      bordered
      v-for="(item, index) in tasks"
      :key="index"
    >
      <q-card-section
        :class="item.estado ? 'tachar' : ''"
        class="col"
        v-html="item.texto"
      />
    <q-card-section class="col">
      <p>{{item.fecha}}</p>
    </q-card-section>
      <q-btn flat color="blue" @click="item.estado = !item.estado;update(item.id)"
        >Tarea hecha</q-btn
      >
      <q-btn flat color="red" @click="eliminar(item.id)">Eliminar</q-btn>
    </q-card>
    <div class="flex text-center" v-if="this.tasks.length == 0">
      <h6>Sin notas</h6>
    </div>
  </div>
</template>

<script>
import {
  db,
  query,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc, Timestamp,
} from "boot/firebase";
export default {
  data() {
    return {
      editor: "",
      tasks: [],
      date:"",
      time:"",
    };
  },
  created() {
    //this.listarTareas();
  },
  methods: {
    async update(id) {
      try {
        const TareaRef = doc(db, "tareas", id);

        // Set the "estado" field to "true"
        await updateDoc(TareaRef, {
          estado: true,
        });

        this.$q.notify({
          message: "Tarea marcada como hecha",
          color: "blue-4",
          textColor: "white",
          icon: "cloud_done",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async listarTareas() {
      try {
        // const resDB= await db.collection('tareas').get();
        const q = query(collection(db, "tareas"));

        const resDB = await getDocs(q);

        resDB.forEach((element) => {
          // console.log(element.id, " ---->", element.data());
          const tarea = {
            id: element.id,
            texto: element.data().texto,
            estado: element.data().estado,
            fecha: element.data().fecha.toDate().toLocaleString(),
          };
          this.tasks.push(tarea);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async saveWork() {
      try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "tareas"), {
          texto: this.editor,
          estado: false,
          fecha: Timestamp.fromDate(new Date(this.date+","+this.time)),
        });
        //console.log("Document written with ID: ", docRef.id);
        this.editor=''

        this.$q.notify({
          message: "Tarea guardada",
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
        });
      } catch (error) {
        console.log(error);
      }
    },
    uploadIt() {
      this.$q.notify({
        message: "Server unavailable. Check connectivity.",
        color: "red-5",
        textColor: "white",
        icon: "warning",
      });
    },
    eliminar(index) {
      this.$q
        .dialog({
          dark: true,
          title: "Accion peligrosa",
          message: "Eliminar la tarea?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          // console.log('>>>> OK')
          //this.tasks.splice(index, 1);
          this.eliminarDoc(index);
          this.$q.notify({
            message: "Tarea eliminada",
            color: "red-5",
            textColor: "white",
            icon: "warning",
          });
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    async eliminarDoc(index) {
      try {
        const docRef = await deleteDoc(doc(db, "tareas", index));
      } catch (error) {
        console.log(error);
        console.log("error al borrar tarea con id: ", index);
      }
    },
  },
  mounted() {
    this.listarTareas();
  },
};
</script>

<style scoped>
.tachar {
  text-decoration: line-through;
}
</style>
