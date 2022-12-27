import React from "react";
import { Input, Button, Select, DatePicker, Radio, FormItem, FormContainer, Card, Notification, toast } from "components/ui";
import { HiMinus } from "react-icons/hi";
import dayjs from "dayjs";

import { Field, FieldArray, getIn, Form, Formik } from "formik";
import * as Yup from "yup";
//import { useNavigate } from "react-router-dom";

const optionsOwner = [
  { value: "Divisi Perencanaan", label: "Divisi Perencanaan" },
  { value: "Divisi Trisuri", label: "Divisi Trisuri" },
  { value: "Divisi Kredit", label: "Divisi Kredit" },
  { value: "Divisi Manajemen Risiko dan Kepatuhan", label: "Divisi Manajemen Risiko dan Kepatuhan" },
];

// const optionsResource = [
//   { value: "Galuh", label: "Galuh" },
//   { value: "Mahendra", label: "Mahendra" },
//   { value: "Fandy", label: "Fandy" },
//   { value: "Shinta", label: "Shinta" },
//   { value: "Dea", label: "Dea" },
//   { value: "Anita", label: "Anita" },
//   { value: "Adji", label: "Adji" },
//   { value: "Trisno", label: "Trisno" },
//   { value: "Bima", label: "Bima" },
//   { value: "Candra", label: "Candra" },
//   { value: "Ian", label: "Ian" },
//   { value: "Brian", label: "Brian" },
//   { value: "Qoirudin", label: "Qoirudin" },
//   { value: "Yoga", label: "Yoga" },
//   { value: "Resta", label: "Resta" },
//   { value: "Heru", label: "Heru" },
//   { value: "Vero", label: "Vero" },
//   { value: "Roni", label: "Roni" },
//   { value: "Ari", label: "Ari" },
// ];

const optionsPrefered = [
  { value: "red", label: <p className="text-red-500">Red</p> },
  { value: "orange", label: <p className="text-orange-500">Orange</p> },
  { value: "amber", label: <p className="text-amber-500">Amber</p> },
  { value: "yellow", label: <p className="text-yellow-500">Yellow</p> },
  { value: "lime", label: <p className="text-lime-500">Lime</p> },
  { value: "green ", label: <p className="text-green-500">Green</p> },
  { value: "emerald", label: <p className="text-emerald-500">Emerald</p> },
  { value: "teal", label: <p className="text-teal-500">Teal</p> },
  { value: "cyan", label: <p className="text-cyan-500">Cyan</p> },
  { value: "sky", label: <p className="text-sky-500">Sky</p> },
  { value: "blue", label: <p className="text-blue-500">Blue</p> },
  { value: "indigo", label: <p className="text-indigo-500">Indigo</p> },
  { value: "purple", label: <p className="text-purple-500">Purple</p> },
  { value: "fuchsia", label: <p className="text-fuchsia-500">Fuchsia</p> },
  { value: "pink", label: <p className="text-pink-500">Pink</p> },
  { value: "rose", label: <p className="text-rose-500">Rose</p> },
];

const openNotification = (type) => {
  toast.push(
    <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
      Success Create a New Project!
    </Notification>
  );
};

const validationSchema = Yup.object().shape({
  project_no: Yup.string().min(13, "Too Short!").max(13, "Too Long!").required("Please input Project No!"),
  project_name: Yup.string().min(1, "Too Short!").max(255, "Too Long!").required("Please input Project Name"),
  project_owner: Yup.string().required("Please select one!"),
  project_priority: Yup.string().required("Please select one!"),
  // project_status: Yup.string().required("Please select one!"),
  project_start: Yup.date().required("Date Required!").nullable(),
  project_end: Yup.date().required("Date Required!").nullable(),
  project_prefered: Yup.string().required("Please select one!"),

  tasks: Yup.array().of(
    Yup.object().shape({
      task_name: Yup.string().required("Please input Task Name!"),
      task_status: Yup.string().required("Please select one!"),
      task_start: Yup.date().required("Date Required!").nullable(),
      task_end: Yup.date().required("Date Required!").nullable(),
    })
  ),
  resources: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Please input Task Name!"),
      position: Yup.string().required("Please select one!"),
    })
  ),
});

const fieldFeedback = (form, name) => {
  const error = getIn(form.errors, name);
  const touch = getIn(form.touched, name);
  return {
    errorMessage: error || "",
    invalid: typeof touch === "undefined" ? false : error && touch,
  };
};

const CreateProject = () => {
  //const navigate = useNavigate();
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          project_no: "",
          project_name: "",
          project_description: "",
          project_owner: "",
          project_priority: "",
          project_status: "",
          project_start: null,
          project_end: null,
          project_prefered: "",
          tasks: [
            {
              task_name: "",
              task_status: "",
              task_start: null,
              task_end: null,
            },
          ],
          resources: [
            {
              name: "",
              position: "",
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const dateNow = dayjs();
          const projectStart = values.project_start;
          const projectEnd = values.project_end;

          if (dateNow >= projectEnd) {
            values.project_status = "Expired";
          } else if (dateNow <= projectEnd && dateNow >= projectStart) {
            values.project_status = "Ongoing";
          } else {
            values.project_status = "New";
          }

          try {
            const response = fetch("http://localhost:5002/projects/create-project", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            console.log(response);
            openNotification("success");
            //setSubmitting(false);
            // resetForm();
            // setTimeout(() => {
            //   navigate("/project/dashboard");
            // }, 1500);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ values, touched, errors, resetForm }) => {
          const tasks = values.tasks;
          const resources = values.resources;

          return (
            <Form>
              <FormContainer>
                <div className="grid grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-4">
                  <Card className="mb-4 col-span-1">
                    <h4 className="mb-4">Project Info</h4>
                    <FormItem label="Project No" asterisk invalid={errors.project_no && touched.project_no} errorMessage={errors.project_no}>
                      <Field type="text" name="project_no" placeholder="ITF-08-100123" component={Input} />
                    </FormItem>
                    <FormItem label="Project Name" asterisk invalid={errors.project_name && touched.project_name} errorMessage={errors.project_name}>
                      <Field type="text" name="project_name" placeholder="" component={Input} />
                    </FormItem>
                    <FormItem label="Project Description" invalid={errors.project_description && touched.project_description} errorMessage={errors.project_description}>
                      <Field type="text" name="project_description" placeholder="" component={Input} textArea />
                    </FormItem>
                    <FormItem label="Project Owner" asterisk invalid={errors.project_owner && touched.project_owner} errorMessage={errors.project_owner}>
                      <Field name="project_owner">
                        {({ field, form }) => (
                          <Select field={field} form={form} options={optionsOwner} value={optionsOwner.filter((option) => option.value === values.project_owner)} onChange={(option) => form.setFieldValue(field.name, option.value)} />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Priority" asterisk invalid={errors.project_priority && touched.project_priority} errorMessage={errors.project_priority}>
                      <Field name="project_priority">
                        {({ field, form }) => (
                          <Radio.Group value={values.project_priority} onChange={(val) => form.setFieldValue(field.name, val)}>
                            <Radio value="Urgent">Urgent</Radio>
                            <Radio value="High">High</Radio>
                            <Radio value="Medium">Medium</Radio>
                            <Radio value="Low">Low</Radio>
                          </Radio.Group>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Start" asterisk invalid={errors.project_start && touched.project_start} errorMessage={errors.project_start}>
                      <Field name="project_start" placeholder="Start Date">
                        {({ field, form }) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project End" asterisk invalid={errors.project_end && touched.project_end} errorMessage={errors.project_end}>
                      <Field name="project_end" placeholder="End Date">
                        {({ field, form }) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Prefered" asterisk invalid={errors.project_prefered && touched.project_prefered} errorMessage={errors.project_prefered}>
                      <Field name="project_prefered">
                        {({ field, form }) => (
                          <Select
                            field={field}
                            form={form}
                            options={optionsPrefered}
                            value={optionsPrefered.filter((option) => option.value === values.project_prefered)}
                            onChange={(option) => form.setFieldValue(field.name, option.value)}
                          />
                        )}
                      </Field>
                    </FormItem>
                  </Card>
                  <div className="col-span-3">
                    <Card className="mb-4 col-span-3">
                      <h4 className="mb-4">Project Tasks</h4>
                      <FormContainer layout="inline">
                        <FieldArray name="tasks">
                          {({ form, remove, push }) => (
                            <div>
                              {tasks && tasks.length > 0
                                ? tasks.map((_, index) => {
                                    const taskNameFeedBack = fieldFeedback(form, `tasks[${index}].task_name`);
                                    const taskStatusFeedBack = fieldFeedback(form, `tasks[${index}].task_status`);
                                    const taskStartFeedBack = fieldFeedback(form, `tasks[${index}].task_start`);
                                    const taskEndFeedBack = fieldFeedback(form, `tasks[${index}].task_end`);

                                    return (
                                      <div key={index}>
                                        <FormItem label="Name" invalid={taskNameFeedBack.invalid} errorMessage={taskNameFeedBack.errorMessage}>
                                          <Field invalid={taskNameFeedBack.invalid} placeholder="Task Name" name={`tasks[${index}].task_name`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="Status" invalid={taskStatusFeedBack.invalid} errorMessage={taskStatusFeedBack.errorMessage}>
                                          <Field invalid={taskStatusFeedBack.invalid} placeholder="Task Name" name={`tasks[${index}].task_status`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="Start" invalid={taskStartFeedBack.invalid} errorMessage={taskStartFeedBack.errorMessage}>
                                          <Field invalid={taskStartFeedBack.invalid} name={`tasks[${index}].task_start`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>
                                        <FormItem label="End" invalid={taskEndFeedBack.invalid} errorMessage={taskEndFeedBack.errorMessage}>
                                          <Field invalid={taskEndFeedBack.invalid} name={`tasks[${index}].task_end`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>

                                        <Button shape="circle" size="sm" icon={<HiMinus />} onClick={() => remove(index)} />
                                      </div>
                                    );
                                  })
                                : null}
                              <div>
                                <Button
                                  type="button"
                                  className="ltr:mr-2 rtl:ml-2"
                                  onClick={() => {
                                    push({ task_name: "", task_status: "", task_start: "", task_end: "" });
                                  }}
                                >
                                  Add a Task
                                </Button>
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </FormContainer>
                    </Card>
                    <Card className="mb-4 col-span-3">
                      <h4 className="mb-4">Project Resources</h4>
                      <FormContainer layout="inline">
                        <FieldArray name="resources">
                          {({ form, remove, push }) => (
                            <div>
                              {resources && resources.length > 0
                                ? resources.map((_, index) => {
                                    const resourceNameFeedBack = fieldFeedback(form, `resources[${index}].name`);
                                    const resourcePositionFeedBack = fieldFeedback(form, `resources[${index}].position`);

                                    return (
                                      <div key={index}>
                                        <FormItem label="Name" invalid={resourceNameFeedBack.invalid} errorMessage={resourceNameFeedBack.errorMessage}>
                                          <Field invalid={resourceNameFeedBack.invalid} name={`resources[${index}].name`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="" invalid={resourcePositionFeedBack.invalid} errorMessage={resourcePositionFeedBack.errorMessage}>
                                          <Field invalid={resourcePositionFeedBack.invalid} name={`resources[${index}].position`}>
                                            {({ field, form }) => (
                                              <Radio.Group value={values.resourcePositionFeedBack} onChange={(val) => form.setFieldValue(field.name, val)}>
                                                <Radio value="Planner">Planner</Radio>
                                                <Radio value="Developer">Developer</Radio>
                                                <Radio value="Quality Assurance">Quality Assurance</Radio>
                                              </Radio.Group>
                                            )}
                                          </Field>
                                        </FormItem>

                                        <Button shape="circle" size="sm" icon={<HiMinus />} onClick={() => remove(index)} />
                                      </div>
                                    );
                                  })
                                : null}
                              <div>
                                <Button
                                  type="button"
                                  className="ltr:mr-2 rtl:ml-2"
                                  onClick={() => {
                                    push({ name: "", position: "" });
                                  }}
                                >
                                  Add a Resource
                                </Button>
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </FormContainer>
                    </Card>
                  </div>
                </div>
                <FormItem>
                  <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={resetForm}>
                    Reset
                  </Button>
                  <Button variant="solid" type="submit">
                    Submit
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateProject;
