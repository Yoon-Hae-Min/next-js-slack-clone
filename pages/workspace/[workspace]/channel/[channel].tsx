import withAuth from '@hooks/HOC/withAuth';
import Workspace from '@layouts/Workspace';

const Channel = () => {
  return (
    <Workspace>
      <div>채널</div>
    </Workspace>
  );
};

export default withAuth(Channel);
