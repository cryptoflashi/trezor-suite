import { AnimatePresence, motion } from 'framer-motion';
import { Card, motionEasing } from '@trezor/components';
import { useSendFormContext } from 'src/hooks/wallet';
import { Address } from './components/Address';
import { Amount } from './components/Amount';
import OpReturn from './components/OpReturn';

interface OutputsProps {
    disableAnim?: boolean; // used in tests, with animations enabled react-testing-library can't find output fields
}

export const Outputs = ({ disableAnim }: OutputsProps) => {
    const { outputs } = useSendFormContext();

    return (
        <>
            <AnimatePresence initial={false}>
                {outputs.map((output, index) => (
                    <motion.div
                        layout
                        key={index}
                        initial={
                            index === 0 || disableAnim ? undefined : { scale: 0.8, opacity: 0 }
                        }
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            duration: 0.25,
                            ease: motionEasing.transition,
                        }}
                    >
                        <Card paddingType="large">
                            {output.type === 'opreturn' ? (
                                <OpReturn outputId={index} />
                            ) : (
                                <>
                                    <Address
                                        output={outputs[index]}
                                        outputId={index}
                                        outputsCount={outputs.length}
                                    />

                                    <Amount output={outputs[index]} outputId={index} />
                                </>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
};
