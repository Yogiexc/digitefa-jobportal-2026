import { Button, Typography } from "antd";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const { Text } = Typography;

const SuccessAppliedJob = ({ toAppliedJobs, companyName, jobTitle }) => {
  console.log("companyName", companyName);
  console.log("jobTitle", jobTitle);
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Text className="text-xl font-medium mb-4">Congratulations!</Text>
      <Text className="text-gray-500">
        You did it! You’ve successfully completed the job application process at{" "}
        {companyName} for the {jobTitle} position. We commend your efforts and
        determination. Now, all that’s left is to wait for the exciting outcome.
        Best of luck on your career journey!
      </Text>
      <Text className="text-gray-500 mt-6 mb-4">
        To view your application history, please go to the Applied Jobs page.
      </Text>
      <Button
        type="primary"
        style={{
          width: 140,
          height: 40,
          borderRadius: 10,
        }}
        onClick={toAppliedJobs}
      >
        <span className="font-medium text-sm">Applied Jobs</span>
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
};

export default SuccessAppliedJob;
