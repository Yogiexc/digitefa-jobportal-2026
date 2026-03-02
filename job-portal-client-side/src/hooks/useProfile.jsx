import { useState } from "react"
import Api from "../services/Api";
import { message } from "antd";

const useProfile = ({ defaultPercentage }) => {
    const sectionEnums = {
        PERSONAL_SUMMARY: 'personalSummary',
        EDUCATION: 'education',
        EXPERIENCE: 'experience',
        SKILL: 'skill',
        PROJECT: 'project',
        CERTIFICATION: 'certification',
        LANGUAGE: 'language',
    }

    const defaultPopUp = {
        [sectionEnums.PERSONAL_SUMMARY]: false,
        [sectionEnums.EDUCATION]: false,
        [sectionEnums.EXPERIENCE]: false,
        [sectionEnums.SKILL]: false,
        [sectionEnums.PROJECT]: false,
        [sectionEnums.CERTIFICATION]: false,
        [sectionEnums.LANGUAGE]: false,
    }

    const actionMessage = {
        [sectionEnums.PERSONAL_SUMMARY]: {
            // put: 'update personal summary successfully!',
            put: 'update personal summary',
        },
        [sectionEnums.EDUCATION]: {
            put: 'update education',
            delete: 'delete education',
        },
        [sectionEnums.EXPERIENCE]: {
            post: 'create new experience',
            put: 'update experience',
            delete: 'delete experience'
        },
        [sectionEnums.SKILL]: {
            post: 'create new skill',
            delete: 'delete skill'
        },
        [sectionEnums.PROJECT]: {
            post: 'create new project',
            put: 'update project',
            delete: 'delete project'
        },
        [sectionEnums.CERTIFICATION]: {
            post: 'create new certification',
            put: 'update certification',
            delete: 'delete certification'
        },
        [sectionEnums.LANGUAGE]: {
            post: 'create new language',
            delete: 'delete language'
        },
    }

    const serviceEndpoint = {
        [sectionEnums.PERSONAL_SUMMARY]: {
            get: '/profile/job-seeker/personal-summary',
            put: '/profile/job-seeker/personal-summary',
        },
        [sectionEnums.EDUCATION]: {
            get: '/profile/job-seeker/education',
            put: '/profile/job-seeker/education',
            delete: '/profile/job-seeker/education',
        },
        [sectionEnums.EXPERIENCE]: {
            get: '/profile/job-seeker/experience',
            post: '/profile/job-seeker/experience',
            put: '/profile/job-seeker/experience/:experience_id',
            delete: '/profile/job-seeker/experience/:experience_id'
        },
        [sectionEnums.SKILL]: {
            get: '/profile/job-seeker/skills',
            post: '/profile/job-seeker/skills',
            delete: '/profile/job-seeker/skills/:skill_id'
        },
        [sectionEnums.PROJECT]: {
            get: '/profile/job-seeker/projects',
            post: '/profile/job-seeker/projects',
            put: '/profile/job-seeker/projects/:project_id',
            delete: '/profile/job-seeker/projects/:project_id'
        },
        [sectionEnums.CERTIFICATION]: {
            get: '/profile/job-seeker/certifications',
            post: '/profile/job-seeker/certifications',
            put: '/profile/job-seeker/certifications/:certification_id',
            delete: '/profile/job-seeker/certifications/:certification_id'
        },
        [sectionEnums.LANGUAGE]: {
            get: '/profile/job-seeker/languages',
            post: '/profile/job-seeker/languages',
            delete: '/profile/job-seeker/languages/:language_id'
        },
    }

    const [messageApi, contextHolder] = message.useMessage();
    const [percentage, setPercentage] = useState(defaultPercentage)
    const [sectionItems, setSectionItems] = useState({
        [sectionEnums.PERSONAL_SUMMARY]: { type: 'text', text: null, percentageComplete: 0 },
        [sectionEnums.EDUCATION]: { type: 'object', text: null, percentageComplete: 0 },
        [sectionEnums.EXPERIENCE]: { type: 'array', list: [], percentageComplete: 0 },
        [sectionEnums.SKILL]: { type: 'array', list: [], percentageComplete: 0 },
        [sectionEnums.PROJECT]: { type: 'array', list: [], percentageComplete: 0 },
        [sectionEnums.CERTIFICATION]: { type: 'array', list: [], percentageComplete: 0 },
        [sectionEnums.LANGUAGE]: { type: 'array', list: [], percentageComplete: 0 },
    });
    const [initialValues, setInitialValues] = useState({})

    const setSectionByElement = (temp, data) => {
        const propertyKey = temp.type === 'array' ? 'list' : 'text'
        temp[propertyKey] = data
        if (temp.percentageComplete === 0) {
            temp.percentageComplete = 10
            setPercentage(percentage + 10)
        }
        return temp
    }

    const refreshSectionItems = (sectionKey, data) => {
        let temp = { ...sectionItems };
        temp[sectionKey] = setSectionByElement(temp[sectionKey], data)
        setSectionItems(temp)
    }

    const getAllSectionData = async () => {
        try {
            let promiseAll = [];
            let mappingKeys = {};
            Object.keys(sectionEnums).forEach((key, idx) => {
                mappingKeys[idx] = { key: sectionEnums[key] }
                promiseAll.push(Api.get(serviceEndpoint[sectionEnums[key]].get))
            })
            const result = await Promise.all(promiseAll);
            let temp = { ...sectionItems }
            let tempPercentage = percentage
            result.forEach((it, idx) => {
                const key = mappingKeys[idx].key
                const item = temp[key];
                const propertyKey = item.type === 'array' ? 'list' : 'text'
                item[propertyKey] = it.data
                if (Array.isArray(it.data)) {
                    item.percentageComplete = it.data.length !== 0 ? 10 : 0
                } else {
                    item.percentageComplete = it.data ? 10 : 0
                }
                tempPercentage += item.percentageComplete

                if (key === sectionEnums.EDUCATION && !it.data.start_date) {
                    item[propertyKey] = null
                    tempPercentage -= item.percentageComplete
                    item.percentageComplete = 0
                }

                temp[key] = item
            })

            setPercentage(tempPercentage)
        } catch (error) {
            console.log('getAllSection', error)
        }
    }

    const getSection = async (sectionKey) => {
        try {
            const { data } = await Api.get(serviceEndpoint[sectionKey].get)
            refreshSectionItems(sectionKey, data)
        } catch (error) {
            console.log('getSection :', error)
        }
    }

    const action = async (sectionKey, method, payload) => {
        let msgType = 'success';
        try {
            let endpoint = serviceEndpoint[sectionKey][method]
            const { primaryKey, values } = payload
            if (primaryKey) {
                endpoint = endpoint.replace(':' + primaryKey, values[primaryKey])
                delete values[primaryKey]
            }
            await Api[method](endpoint, values)
            await getSection(sectionKey)
        } catch (error) {
            msgType = 'error'
            console.log(`action ${method} :`, error)
        } finally {
            messageApi.open({ type: msgType, content: `${msgType} ${actionMessage[sectionKey][method]}` })
        }
    }

    return { sectionEnums, defaultPopUp, initialValues, sectionItems, contextHolder, percentage, setInitialValues, getAllSectionData, action }
}

export { useProfile }